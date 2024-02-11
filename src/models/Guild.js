class Guild {
    /**
     * 
     * @param {*} uniqueID id unico nuestro
     * @param {*} id id de discord
     * @param {*} name nombre del servidor
     * @param {*} description descripcion del servidor
     */
    constructor(uniqueID, id, name, description) {
        this.uniqueID = uniqueID;
        this.id = id;
        this.name = name;
        this.description = description;
    }
}
module.exports = Guild;