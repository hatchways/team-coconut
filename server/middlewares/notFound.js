module.exports = function(req, res){
    res.status(404).json({ errors: [{ msg: "Path not found" }] });
}