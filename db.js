const { query } = require('express');

const sqlite3 = require('sqlite3').verbose()

let db = null;

//insert into usuarios (nombre,Email,servicio,rango,tel,fechaI,DNI) VALUES ('pepe2','pepe2@gmail.com','entrenamiento','cliente',2213102802,'7/10/2024',49249768)

function obtenerDB(ruta) {
  if (db == null) {
    db = new sqlite3.Database(ruta, sqlite3.OPEN_READWRITE | sqlite3.OPEN_FULLMUTEX, (err) => {
      if (err) {
        console.error('Error al abrir la base de datos', err.message);
      } else {
        console.log('Conectado a la base de datos SQLite');
      }
    });
  }

  return db
}

const verQuery = (condicion, tabla) => {
  let query1;
  if (condicion !== undefined) {
    query1 = `SELECT * FROM ${tabla} where usuarios.contrasena == "${condicion[0]}" and usuarios.DNI == ${condicion[1]}  `
    // console.log('usando condicion')
    return query1
  } else {
    query1 = `SELECT * FROM ${tabla}`
    // console.log('no usando condicion')
    return query1
  }

}


const obtenerDatosTabla = (tabla, condicion = undefined) => {
  const query1 = verQuery(condicion, tabla)

  return new Promise((resolve, reject) => {
    obtenerDB().all(query1, [], (err, info) => {
      try {
        resolve(info);

      } catch (err) {
        // console.error(err);
        reject(err);
      }
    });
  });

}


const enviarQuerysP = (query1) => {
  return new Promise((resolve, reject) => {
    obtenerDB().all(query1, [], (err, info) => {
      try {
        resolve(info);

      } catch (err) {
        console.error(err);
        reject(err);
      }
    });
  });
}














const consultaUsuariosInsert = 'insert into usuarios (nombre,Email,rango,tel,fechaI,DNI,contrasena) VALUES (?,?,?,?,?,?,?)';
const consultaclientesInsert = 'insert into clientes (clienteDNI,entrenadorDNI,nombreU) VALUES (?,?,?)';
const consultaEntrenamientosInsert = 'insert into entrenamientos (UsuarioDNI,dia,hs,entrenamientos) values (?,?,?,?)';
const consultaHistiorialInsert = 'insert into historialEnt (usuarioDNI,entrenamiento,dia,hs,fechaI,entrenadorDNI) values (?,?,?,?,?,?)';



function insertarDatosHistorial(valores) {
  return new Promise((resolve, reject) => {
    if (valores.length == 6) {
      try {
        obtenerDB().run(consultaHistiorialInsert, valores, (err) => {
          if (err) {
            reject(err);
          } else {
            resolve('Inserción exitosa');
            console.log('Inserción exitosa')

          }
        });
      } catch (error) {
        if (error == 'SQLITE_CONSTRAINT: UNIQUE constraint failed: usuarios.DNI') {
          console.log('ya esta registrado ese DNI')
        }
      }

    } else {
      reject(new Error('La longitud de los valores no es correcta'));
    }
  });

}


function insertarDatosEntrenamientos(valores) {
  return new Promise((resolve, reject) => {
    if (valores.length == 4) {
      try {
        obtenerDB().run(consultaEntrenamientosInsert, valores, (err) => {
          if (err) {
            reject(err);
          } else {
            resolve('Inserción exitosa');
            console.log('Inserción exitosa')

          }
        });
      } catch (error) {
        if (error == 'SQLITE_CONSTRAINT: UNIQUE constraint failed: usuarios.DNI') {
          console.log('ya esta registrado ese DNI')
        }
      }

    } else {
      reject(new Error('La longitud de los valores no es correcta'));
    }
  });

}




function insertarDatosUsuarios(valores,valores2,si =false) {
  return new Promise((resolve, reject) => {
    if (valores.length == 7) {
      try {
        obtenerDB().run(consultaUsuariosInsert, valores, (err) => {
          if (err) {
            reject(err);
          } else {
            if(si){
              obtenerDB().run(consultaclientesInsert, valores2, (err) => {
              if (err) {
                reject(err);
              } else {
                resolve('Inserción 2 exitosa');
                console.log('Inserción exitosa')
              }
            });
            }
            resolve('Inserción exitosa');
            console.log('Inserción exitosa')

          }
        });
      } catch (error) {
        if (error == 'SQLITE_CONSTRAINT: UNIQUE constraint failed: usuarios.DNI') {
          console.log('ya esta registrado ese DNI')
        }
      }

    } else {
      reject(new Error('La longitud de los valores no es correcta'));
    }
  });

}


function eliminarUsuario(valores) {
  const consultaEliminarUsuario = `delete from usuarios where usuarios.DNI == ${valores[0]} and usuarios.contrasena = ${valores[1]}`;
  return new Promise((res, rej) => {
    if (valores.length == 2) {
      obtenerDB().run(consultaEliminarUsuario,[], (err) => {
        if (err) {
          rej(err)
        } else {
          res('se elimino correctamente')

        }
      })
    } else {
      rej('los Valores no son correctos')
    }
  })

}
function eliminarcliente(valores) {
  const consultaEliminarUsuario = `delete from clientes where clientes.clienteDNI == ${valores[0]}`;
  return new Promise((res, rej) => {
    if (valores.length == 1) {
      obtenerDB().run(consultaEliminarUsuario,[], (err) => {
        if (err) {
          rej(err)
        } else {
          res('se elimino correctamente')

        }
      })
    } else {
      rej('los Valores no son correctos')
    }
  })

}





module.exports = { obtenerDB, obtenerDatosTabla,insertarDatosHistorial, insertarDatosUsuarios,insertarDatosEntrenamientos, eliminarUsuario, enviarQuerysP,eliminarcliente }

