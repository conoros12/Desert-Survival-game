from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField, SubmitField
from wtforms.validators import InputRequired, EqualTo

class RegistrationForm(FlaskForm):
    user_id = StringField("User_id: ",
                          validators=[InputRequired()])
    password = PasswordField("Password: ",
                             validators=[InputRequired()])
    password2 = PasswordField("Confirm Password: ",
                              validators=[InputRequired(),
                                          EqualTo("password")])
    submit = SubmitField("Register")

class LoginForm(FlaskForm):
    user_id = StringField("User id: ",
                          validators=[InputRequired()])
    password = PasswordField("Password: ",
                             validators=[InputRequired()])
    submit = SubmitField("Login")