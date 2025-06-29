const getPool = require("../data/konektor");

class User {
    constructor(ime, email, lozinka, uloga, sluzba, avatar){
        this.ime = ime
        this.email = email
        this.lozinka = lozinka
        this.uloga = uloga
        this.sluzba = sluzba
        this.avatar = avatar || null
    }

    async proveraNaloga(){
        const pool = await getPool();
        try {
            const upit = "SELECT email FROM users WHERE email = (?)";
            let rezultat = await pool.querry(upit, [this.email]);
            if(rezultat[0]){
                return true
            }    
            return false
        } catch (error) {
            console.log(error.message);
            throw new Error ("Greska prilikom provere naloga u funkciji proveraNaloga")
        } 
    }

}

module.exports = User;