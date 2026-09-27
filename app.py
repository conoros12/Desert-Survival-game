from flask import Flask, render_template, redirect, url_for, session, request, g
from forms import RegistrationForm, LoginForm
from flask_session import Session
from database import get_db, close_db
from werkzeug.security import generate_password_hash, check_password_hash
from functools import wraps

app = Flask(__name__)
app.teardown_appcontext(close_db)
app.config["SECRET_KEY"] = "this-is-my-secret-key"
app.config["SESSION_TYPE"] = "filesystem"
Session(app)

#Login for admin. Username: admin, password: 123


@app.before_request
def load_logged_in_user():
    g.user = session.get("user_id", None)


def login_required(view):
    @wraps(view)
    def wrapped_view(*args, **kwargs):
        if g.user is None:
            return redirect(url_for("login", next=request.url))
        return view(*args, **kwargs)
    return wrapped_view

def admin_required(view):
    @wraps(view)
    def wrapped_view(*args, **kwargs):
        if g.user != 'admin':
            return redirect(url_for("login", next=request.url))
        return view(*args, **kwargs)
    return wrapped_view

@app.route("/")
def index():
    return render_template("index.html", title = "Home Page")

@app.route("/game")
def game():
    return render_template("game.html")


@app.route("/register", methods=["GET", "POST"])
def register():
    form = RegistrationForm()
    if form.validate_on_submit():
        user_id = form.user_id.data
        password = form.password.data
        db = get_db()
        clash = db.execute("""SELECT * FROM users
                           WHERE user_id = ?;""", (user_id, )).fetchone()
        if clash is not None:
            form.user_id.errors.append("This username is already taken! ")
        
        else:
            db.execute("""INSERT INTO users (user_id, password)
                       VALUES (?, ?);""", 
                       (user_id, generate_password_hash(password)))
            db.commit()
            return redirect(url_for('login'))
    return render_template("register.html", form=form)

@app.route("/login", methods=["GET", "POST"])
def login():
    form = LoginForm()
    if form.validate_on_submit():
        user_id = form.user_id.data
        password = form.password.data
        db = get_db()
        user_in_db = db.execute("""SELECT *
                                FROM users WHERE user_id = ?;""", (user_id, )).fetchone()

        if user_in_db is None:
            form.user_id.errors.append("No such username!")
        elif not check_password_hash(
                    user_in_db["password"], password):
            form.password.append("Incorrect Password!")
        else:
            session.clear()
            session["user_id"] = user_id
            session.modified = True
            next_page = request.args.get("next")
            if not next_page:
                next_page = url_for('index')
            return redirect(next_page)
    return render_template("login.html", form=form)

@app.route("/logout")
def logout():
    session.clear()
    session.modified = True
    return redirect(url_for("index"))

@app.route("/store_score", methods=["POST"])
@login_required
def store_score():
    try:
        score = int(request.form["score"])
        db = get_db()
        db.execute("""INSERT INTO scores (user_id, score)
                VALUES (?, ?);""", (g.user, score))
        db.commit()
        return "success"
    except Exception:
        print("Error storing score: ", Exception)
        return "failure"
    
@app.route("/leaderboard")
def leaderboard():
    db = get_db()
    top_scores = db.execute("""SELECT user_id, MAX(score) AS high_score
                            FROM scores
                            GROUP BY user_id
                            ORDER BY high_score DESC;""").fetchall()
    
    if g.user == "admin":
        users = db.execute("""SELECT DISTINCT user_id
                           FROM scores;""").fetchall()
        return render_template("leaderboard.html", scores=top_scores, users=users)
    
    return render_template("leaderboard.html", scores=top_scores)

@app.route("/remove_from_leaderboard", methods = ["GET", "POST"])
@admin_required
def remove_from_leaderboard():
    db = get_db()
    if request.method == "POST":
        user_id = request.form.get("user_id")
        if user_id:
            db.execute("""DELETE FROM scores
                       WHERE user_id = ?;""", (user_id, ))
            db.commit()
            return redirect(url_for('leaderboard'))
        
    users = db.execute("""SELECT DISTINCT user_id
                          FROM scores;""").fetchall()
    return render_template("leaderboard.html", users=users)



@app.route("/credits")
def credits():
    return render_template("credits.html")
