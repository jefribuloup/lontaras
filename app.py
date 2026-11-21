import os

from flask import Flask, render_template

app = Flask(__name__)
app.config["SECRET_KEY"] = os.environ.get("SECRET_KEY", "dev-only-change-me")


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/kebijakan-privasi")
def privacy():
    return render_template("privacy.html")


@app.route("/syarat-layanan")
def terms():
    return render_template("terms.html")


@app.errorhandler(404)
def not_found(_error):
    return render_template("index.html"), 404


if __name__ == "__main__":
    app.run(debug=True)
