const express = require('express')
const db = require('../db.js')



const router = express.Router()



router.post('/obtenerContrasena', async (req, res) => {
    console.log(req.body)
    if (req.body.Email && req.body.DNI) {
        try {
            console.log(`"${req.body.Email}"`)
            let [...usuarios] = await db.enviarQuerysP(`select * from usuarios where usuarios.DNI == ${parseInt(req.body.DNI)} and usuarios.Email == "${req.body.Email}" `)

            if (usuarios.length == 1) {
                res.send(JSON.stringify({"contrasena" : usuarios[0].contrasena}))
                console.log('mandado')
                console.log(usuarios[0].contrasena)
            } else {
                res.send(JSON.stringify({"error": 404}))

            }

        } catch (error) {
            console.log('ocurrio un error' + error)
            res.send(JSON.stringify({"error" : 'no se pudo encontrar el usuario'}))
        }


    } else {
        res.send(JSON.stringify({"error": 'por favor ingresa la contraseña y el Email'}))
    }
});


router.post('/iniciarSecion', async (req, res) => {
    console.log(req.body)
    if (req.body.contrasena && req.body.DNI) {
        try {
            console.log(`"${req.body.contrasena}"`)
            let [...usuario2] = await db.enviarQuerysP(`select * from usuarios where usuarios.Email == "${req.body.DNI}"`)

            console.log(usuario2)

            let usuario3 = usuario2[0].DNI


            let [...usuarios] = await db.obtenerDatosTabla("usuarios", [req.body.contrasena, usuario3])
            if (usuarios.length == 1) {
                res.send(JSON.stringify(usuarios[0]))
                console.log('mandado')
                console.log(usuarios)
            } else {
                res.send(JSON.stringify({"error": 404}))

            }

        } catch (error) {
            console.log('ocurrio un error' + error)
            res.send(JSON.stringify({"error" : 'no se pudo encontrar el usuario'}))
        }


    } else {
        res.send(JSON.stringify({"error": 'por favor ingresa la contraseña y el Email'}))
    }
});



router.post('/eliminarEntrenamiento',async (req,res)=>{
    if(req.body.id){
        try {
            await db.enviarQuerysP(`delete from entrenamientos where entrenamientos.id == ${req.body.id}`)
            res.send('eliminado correctamente')
            console.log('eliminado correctamente')
        } catch (error) {
            res.send('hubo un error')
            console.log(error)  
        }
    }
})


router.post('/obtHisEnt', async (req, res) => {
    console.log(req.body)
    if (req.body.DNI) {
        try {
            let entrenamientos = await db.enviarQuerysP(`select * from  historialEnt where historialEnt.usuarioDNI== ${req.body.DNI}`)
            res.send(entrenamientos)
        } catch (error) {
            res.send('no se pudo haceder ')
            console.log(error)
        }

    } else {
        res.send('no se envio el DNI')
    }

})

router.post('/obtEnt', async (req, res) => {
    console.log(req.body)
    if (req.body.userDNI) {
        try {
            let entrenamientos = await db.enviarQuerysP(`select * from  entrenamientos where entrenamientos.usuarioDNI== ${req.body.userDNI}`)
            res.send(entrenamientos)
        } catch (error) {
            res.send('no se pudo haceder ')
            console.log(error)
        }

    } else {
        res.send('no se envio el DNI')
    }

})

router.post('/addEntrenamiento', async (req, res) => {
    // console.log(req.body)
    if (req.body.DNI && req.body.contrasena) {
        let usuarios = await db.obtenerDatosTabla("usuarios", [req.body.contrasena, req.body.DNI])
        if (usuarios.length == 1) {
            if (usuarios[0].rango == 'entrenador') {
                if (req.body.usuarioDNI && req.body.dia && req.body.hs && req.body.entrenamiento) {
                    try {
                        const fecha = new Date()
                        const fechaI1 = `${fecha.getDate()}/${fecha.getMonth()}/${fecha.getFullYear()}` 
                        await db.insertarDatosEntrenamientos([req.body.usuarioDNI,req.body.dia,req.body.hs,req.body.entrenamiento])
                        await db.insertarDatosHistorial([req.body.usuarioDNI,req.body.entrenamiento,req.body.dia,req.body.hs,fechaI1,req.body.DNI])
                        res.send('insertado correctamente')
                        console.log('insertado correctamente')
                    } catch (error) {
                        res.send('hubo un error')
                        console.log(error)  
                    }
                    

                }else{
                    res.send('faltan los datos del entrenamiento')
                }
            } else {
                res.send('no tiene los privilegios de usuario ')
            }
        } else {
            res.send('no existe este usuario')
        }
    } else {
        res.send('envie datos correctos')
    }

})


router.post('/obtUE', async (req, res) => {
    // console.log(req.body)
    if (req.body.contrasena && req.body.DNI) {
        let usuarios = await db.obtenerDatosTabla("usuarios", [req.body.contrasena, req.body.DNI])
        if (usuarios.length == 1) {
            let [...info] = await db.enviarQuerysP(`select * from clientes where clientes.entrenadorDNI == ${req.body.DNI}`)
            res.send(info)
        } else {
            res.send('no se pudo encontrar el entrenador')
        }

    } else {
        res.send('envie los datos correctos')
    }
})



router.post('/obtenerUsuarios', async (req, res) => {
    // console.log(req.body)
    if (req.body.contrasena && req.body.DNI) {
        try {
            // console.log(req.body)
            let [...usuarios] = await db.enviarQuerysP(`select * from usuarios where usuarios.DNI == ${req.body.DNI} and usuarios.contrasena == "${req.body.contrasena}"`)
            console.log(usuarios)
            if (usuarios.length == 1) {
                if (usuarios[0].rango == 'administrador') {
                    let [...info] = await db.enviarQuerysP(`select * from usuarios`)
                    // console.log(info)

                    res.send(info)
                    return
                } else {
                    res.send('no tiene el rango nesesario')
                    return
                }

            } else {
                res.send('no estas registrado')
                return

            }
        } catch (error) {
            console.log('ocurrio un error' + error)
            res.send('no se pudo encontrar el usuario')
        }

    } else {
        res.send('envie datos correctos')
    }

})


router.post('/updateUsers',async (req,res)=>{
    console.log(req.body)
    if (req.body.DNI
        && req.body.nombre
        && req.body.Email
        && req.body.rango
        && req.body.tel
        && req.body.fechaI
    ) {
        console.log(req.body.rango.toLowerCase())
        try {
            const query1 = `UPDATE usuarios SET nombre = "${req.body.nombre}",Email  = "${req.body.Email}",rango = "${req.body.rango.toLowerCase()}",tel = ${parseInt(req.body.tel)},fechaI = "${req.body.fechaI}" where DNI == ${parseInt(req.body.DNI)}`
            console.log(query1)
            await db.enviarQuerysP(query1)
            res.send('datos actualizados con exito')
            console.log('modificado correctamente ')
        } catch (error) {
            res.send( 'No se pudieron actualizar los datos')
            console.log(error)
        }
    }else {
        res.send( 'envia los datos correctos')

    }
})

// db.insertarDatosUsuarios(["Nico Miras","nicomiras20@gmail.com","entrenamiento","cliente",2213102801,"18/2/2024",49249767,77771])

router.post('/registrarse', async (req, res) => {
    // console.log(req.body)
    if (req.body.DNI
        && req.body.nombre
        && req.body.Email
        && req.body.rango
        && req.body.tel
        && req.body.fechaI
        && req.body.contrasena
        ||
        req.body.DNI
        && req.body.nombre
        && req.body.Email
        && req.body.rango
        && req.body.tel
        && req.body.fechaI
        && req.body.contrasena
        && req.body.entrenadorDNI
    ) {
        console.log(req.body)
        try {
            console.log('hasta aca to good 1')
            let usuarios = await db.enviarQuerysP(`select * from usuarios where usuarios.DNI == ${req.body.DNI} and usuarios.contrasena == "${req.body.contrasena}" or usuarios.DNI == ${req.body.DNI}`)
            console.log('hasta aca to good 2')

            if (usuarios.length == 1) {
                console.log('hasta aca to good 3')
                console.log('ya esta registrado')

                res.send('ya esta registrado')
                return
            } else {
                console.log('hasta aca to good 4')
                if (req.body.rango == 'cliente' && req.body.entrenadorDNI) {
                    db.insertarDatosUsuarios([req.body.nombre, req.body.Email, req.body.rango, parseInt(req.body.tel), req.body.fechaI, parseInt(req.body.DNI), req.body.contrasena], [parseInt(req.body.DNI), parseInt(req.body.entrenadorDNI), req.body.nombre], true)
                    res.send('registrando...')
                    console.log('hasta aca to good 5')
                } else {
                    db.insertarDatosUsuarios([req.body.nombre, req.body.Email, req.body.rango, parseInt(req.body.tel), req.body.fechaI, parseInt(req.body.DNI), req.body.contrasena], [])
                    res.send('registrando...')
                    console.log('hasta aca to good 5')

                }

                return

            }
        } catch (error) {
            console.log('ocurrio un error' + error)
            res.send('no se pudo registrar el usuario por favor intente de nuevo')
        }

    } else {
        res.send('envie datos correctos')
    }

})


router.post('/eliminar', async (req, res) => {
    if (req.body.DNI
        && req.body.contrasena
    ) {
        if (req.body.rango == 'cliente') {
            db.eliminarcliente([req.body.DNI])

        }
        console.log(`"${req.body.contrasena}"`)
        db.eliminarUsuario([req.body.DNI, `"${req.body.contrasena}"`])
            .then((res1) => {
                console.log(res1)
                res.send('eliminado')
            }).catch((rej) => {
                res.send(rej)
                console.log(rej)
            })
    } else {
        res.send('ingrese los datos correctos')
    }

})



module.exports = router