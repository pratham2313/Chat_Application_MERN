class Controller {

    static index(req, res) {
        res.send("hi from controller");
    }
}

module.exports = Controller;