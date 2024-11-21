import express from "express";
import mysql from "mysql2";
import cors from 'cors';        // site cross-domain
import multer from 'multer';    // adjuntar archivos
import { body, validationResult } from 'express-validator';

/*************************************************************
 * Servicio Web
 *************************************************************/

// Servidor web Express
const app = express();
app.use(express.json());
app.use(cors());

// Mensaje de bienvenida
app.get( '/' , (req, res) => {
    res.send('Backend en Node.JS API en linea.'); // html
});


/*************************************************************
 * Base de datos
 *************************************************************/

// Conexión a MySQL
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "pruebas123", // "" para laptop azul y "pruebas123" para la gris
    database: "qadb"
});

// Comprobar conexión a MySQL
db.connect( function(error) {
    if(error){
        console.log('Error conectando a MySQL...');
        console.log(error);
        throw error;
    }
    else{
        console.log('Conexión a MySQL exitosa.');
    }
});

/*************************************************************
 * API Enpoints
 *************************************************************/

//::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
// CheckList
//::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

// GetAll CheckList MYSQL
app.get( '/api/qa/check_list' , async(req,res) => {
    
    const sql = "call sp_SelectAll_Check_List();";

    const result = db.query(sql, (err, data) => {

        if(err) {
            console.log('API Error: ', err );
            return res.json("API Error : " + err);
        }        

        console.log('CheckList: ',data);        
        
        // console.log(data[0]); //res.send(res.json(data)); html
        return res.json(data[0]);
    })   
} );

// DELETE Check_List
app.delete( '/api/qa/check_list',[
    body('CheckListId').notEmpty().withMessage('El parametro CheckListId es obligatorio'),
],  async(req,res) => {
    console.log('--------------------------------------------------------------')
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log(errors.array())
        return res.status(400).json({ errors: errors.array() });
    }
    
    try {
        const sql = "DELETE FROM Check_List WHERE Check_List_Id = '"+req.body.CheckListId+"' ;";
        console.log(sql)
        const result = db.query(sql, (err, data) => {
            if(err) {
                console.errror(err)
                return res.json("MySQL: "+err);
            }
            //res.send(res.json(data));        
            //console.log('Row(s): '+data.length);
            console.log('sp_Delete_CheckList',data);
            return res.json(data);
        })          
    }
    catch(error) {
        console.log('Endpoint error...');
        console.log(error);
        return res.json(error);
        //return res.status(500).json(error);
    } 
} );

// UPDATE Check_List
app.put( '/api/qa/check_list',[
    body('CheckListId').notEmpty().withMessage('El parametro CheckListId es obligatorio'),
    body('Item').notEmpty().withMessage('El parametro Item es obligatorio'),        
    body('Activo').notEmpty().withMessage('El parametro Activo es obligatorio'),
    body('TipoTestId').notEmpty().withMessage('El parametro TipoTestId es obligatorio'),    
], async(req,res) => { 
        
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log(errors.array())
        return res.status(400).json({ errors: errors.array() });
    }

    const datos = [
        req.body.CheckListId ,
        req.body.Item ,               
        1      ,
        req.body.Activo,        
    ];
    console.log( 'Check_List',datos );
    const script = "call sp_Update_Check_List ( ?,?, ?, ? )"; // 3 parametros

    const output = db.execute(script, datos, (err, data) => {         
        if(err) {
            console.error("MySQL: ",err)
            return res.json("MySQL: " + err);
        }
        // res.send(res.json(data));
        console.log(data);
        return res.json(data);
    });
} )

// INSERT Check_List
app.post( '/api/qa/check_list', [
    body('CheckListId').notEmpty().withMessage('El parametro CheckListId es obligatorio'),
    body('Item').notEmpty().withMessage('El parametro Item es obligatorio'),    
    // body('TipoTestId').notEmpty().withMessage('El parametro TipoTestId es obligatorio'),
    body('Activo').notEmpty().withMessage('El parametro Activo es obligatorio'),    
], async(req,res) => { 
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log(errors.array())
        return res.status(400).json({ errors: errors.array() });
    }

    const datos = [
        req.body.CheckListId ,
        req.body.Item ,       
        1, 
        req.body.Activo             
    ];
    console.log( 'Check_List',datos );
    const script = "call sp_Insert_Check_List ( ?,?, ?, ? )"; // 3 parametros

    const output = db.execute(script, datos, (err, data) => {         
        if(err) {
            console.error("MySQL: ",err)
            return res.json("MySQL: " + err);
        }
        // res.send(res.json(data));
        console.log(data);
        return res.json(data);
    });
} )


//::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
// DASHBOARD
//::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::


// UPDATE Dashboard
app.put( '/api/qa/dashboard',[
    body('id').notEmpty().withMessage('El parametro id es obligatorio'),
    body('cantidad').notEmpty().withMessage('El parametro cantidad es obligatorio'),            
], async(req,res) => { 
        
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log('dashboard UPDATE',errors.array())
        return res.status(400).json({ errors: errors.array() });
    }

    const datos = [        
        req.body.cantidad ,
        req.body.id ,
    ];

    // console.log( 'dashboard',datos );

    const script = "UPDATE DASHBOARD SET cantidad = cantidad + ? where id = ?; "; // 2 parametros

    const output = db.execute(script, datos, (err, data) => {         
        if(err) {
            console.error("MySQL dashboard: ",err)
            return res.json("MySQL: " + err);
        }
        // res.send(res.json(data));
        console.log(data);
        return res.json(data);
    });
} )

// GetAll_Dashboard
app.get( '/api/qa/dashboard', async (req, res) => {    
        
    const sql = "SELECT * FROM DASHBOARD ;";

    const result =  db.query(sql, (err, data) => {

        if(err) {
            console.log('API Error: ', err );
            return res.json("API Error : " + err);
        }        

        console.log('CheckList: ',data);        
        
        // console.log(data[0]); //res.send(res.json(data)); html
        return res.json(data);
    })
});


//::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
// DETALLE REVISION
//::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

// Insert o Update if already exists
app.post( '/api/qa/detalle_revision' , (req, res) => {       
    const datos = [
        req.body.Proyecto_Id ,
        req.body.Etapa_Id ,
        req.body.Revision_Id ,
        req.body.Check_List_Id ,
        req.body.Marcado ,
        (req.body.Fecha == null || req.body.Fecha == undefined || req.body.Fecha=='Invalid date')
        ? null : req.body.Fecha
    ];        
    console.log( 'detalle_revision',datos );
    const script = "call sp_Insert_Detalle_Revision ( ?,?, ?,?, ?,? )"; // 6 parametros

    const output = db.execute(script, datos, (err, data) => {         
        if(err) {
            console.log("MySQL sp_Insert_Detalle_Revision: " + err)
            return res.json(err);
        }
        // res.send(res.json(data));
        console.log('sp_Insert_Detalle_Revision',data);
        return res.json(data);
    });
});

// Get Revision By PK
app.get( '/api/qa/detalle_revision/:proyId/:etapaId/:revId' , (req, res) => {    
    
    const sql = "call sp_Select_Detalle_Revision( "+req.params.proyId+" , "+ req.params.etapaId+" , "+req.params.revId+" );";

    const result = db.query(sql, (err, data) => {

        if(err) {
            console.log('API Error: ', err );
            return res.json("API Error : " + err);
        }        
        // console.log('sp_Select_Detalle_Revision: ',data);        
        //res.send(res.json(data));
        // console.log(data[0]);
        return res.json(data[0]);
    })     
});

//::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
// REVISION
//::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

// Insert o Update if already exists
app.post( '/api/qa/revision' , (req, res) => {       
    const datos = [
        req.body.Proyecto_Id ,
        req.body.Etapa_Id ,        
        req.body.Revision_Id ,    
        req.body.Fecha,
        req.body.Estado     
    ];        
    console.log( 'revision',datos );
    const script = "call sp_Insert_Revision ( ?,?, ?,?,? )"; // 4 parametros

    const output = db.execute(script, datos, (err, data) => {         
        if(err) {
            console.log("MySQL: " + err)
            return res.json("MySQL: " + err);
        }
        // res.send(res.json(data));
        console.log('sp_Insert_Revision',data);
        return res.json(data);
    });
});

// Get Revision By PK
app.get( '/api/qa/revision/:proyId/:etapaId' , (req, res) => {    
    
    const sql = "call sp_Select_Revision( "+req.params.proyId+" , "+ req.params.etapaId+" );";

    const result = db.query(sql, (err, data) => {

        if(err) {
            console.log('API Error: ', err );
            return res.json("API Error : " + err);
        }        
        console.log('sp_Select_Revision: ',data);        
        //res.send(res.json(data));
        // console.log(data[0]);
        return res.json(data[0]);
    })     
});

//::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
// PROYECTO - ETAPA
//::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

// PATCH_Proyecto_Etapa
app.patch( '/api/qa/etapa' , async (req, res) => {    
    //console.log(req.body);
    const datos = [
        req.body.estado,        
        req.body.id,
        req.body.etapaId
    ]
    
    const sql = "UPDATE PROY_ETAPAS "+
    "SET Estado=? , FECHA_FINAL =NOW() WHERE PROYECTO_ID = ? and Etapa_Id= ?"
    
    //console.log( PATCH_Proyecto_Etapa,sql )
    
    db.query(sql, datos, (err, data) => {
        if(err) {
            console.error("PATCH_Proyecto_Etapa: ", err);            
            return res.json("API: " + err);
        }

        //res.send(res.json(data)); html
        //console.log(data);
        return res.json(data);
    })    
});

// Get Proyecto Etapa By Pk
app.get( '/api/qa/proy_etapa/:proyId' , (req, res) => {    
    
    const sql = "call sp_Select_Proy_Etapa( "+req.params.proyId+" );";

    const result = db.query(sql, (err, data) => {

        if(err) {
            console.log('API Error: ', err );
            return res.json("API Error : " + err);
        }        
        // console.log('sp_Select_Proy_Etapa: ',data);        
        //res.send(res.json(data));
        // console.log(data[0]);
        return res.json(data[0]);
    })     
});

// Insert_Proy_Etapa
app.post( '/api/qa/proy_etapa' , (req, res) => {       
    const datos = [
        req.body.id,
        req.body.etapaId,
        req.body.estado,
        req.body.dev,
        req.body.tester,
        req.body.manualTecnico,
        req.body.manualDeploy,
        req.body.cronograma,
        req.body.ambiente,
        req.body.acceso,
        req.body.permisos,
        req.body.instanciaDB,
        req.body.serverName,
        req.body.fechaInicio,
        req.body.fechaFinal===undefined || req.body.fechaFinal==='null' ? null :req.body.fechaFinal
    ];        
    console.log('Insert_Proy_Etapa',datos );
    const script = "call sp_Insert_Proy_Etapa ( ?,?,?,?,?,?,?,?,?,?,?,?,?,?,? )"; // 15 parametros

    const output = db.execute(script, datos, (err, data) => {         
        if(err) {
            console.log('sp_Insert_Proy_Etapa',err);
            return res.json("Error API: " + err);
        }
        // res.send(res.json(data));
        // console.log('sp_Insert_Proy_Etapa',data);
        return res.json(data);
    });
});

// GetALL Proyecto Etapa By Pk
app.get( '/api/qa/etapas/:proyId' , (req, res) => {    
    
    const sql = "call sp_Select_Proy_Etapas( "+req.params.proyId+" );";
    
    const result = db.query(sql, (err, data) => {

        if(err) {
            console.log('API Error: ', err );
            return res.json("API Error : " + err);
        }        
        // console.log('sp_Select_Proy_Etapas: ',data);        
        //res.send(res.json(data));
        // console.log(data[0]);
        return res.json(data[0]);
    })     
});

// GetALL Etapa 
app.get( '/api/qa/etapas' , (req, res) => {    
    
    const sql = "call sp_SelectAll_Etapas();";

    const result = db.query(sql, (err, data) => {

        if(err) {
            console.log('API Error: ', err );
            return res.json("API Error : " + err);
        }        
        // console.log('sp_SelectAll_Etapa: ',data);        
        //res.send(res.json(data));
        // console.log(data[0]);
        return res.json(data[0]);
    })     
});

//----------------------------------------------------------------------
// PROYECTOS
//----------------------------------------------------------------------

// UPDATE_PROYECTO
app.put( '/api/qa/proyecto' , async (req, res) => {    
    console.log('UPDATE_PROYECTO',req.body);   
    
    const sql = "call sp_Update_Proyecto (" +
    req.body.proy_id + ", '" + 
    req.body.proyName + "', '" +
    req.body.user + "', '" +
    req.body.created + "', '" + //"',now(),'" + 
    req.body.estado + "');"
    
    console.log('sp_Update_Proyecto: ', sql )
    
    db.query(sql, (err, data) => {
        if(err) {
            console.error("MySQL sp_Update_Proyecto: ",err);
            // console.error(err);
            return res.json("MySQL: " + err);
        }
        //res.send(res.json(data));
        //console.log(data);
       
        console.log('sp_Update_Proyecto: ', data);

        return res.json(data);
    })    
});

// PATCH Proyecto
app.patch( '/api/qa/proyecto' , async (req, res) => {    
    //console.log(req.body);
    const datos = [
        req.body.estado,
        req.body.id
    ]
    
    const sql = "UPDATE PROYECTOS SET ESTADO=? WHERE PROYECTO_ID = ? ;" 
    //+"UPDATE PROY_ETAPAS SET FECHA_FINAL =NOW() WHERE PROYECTO_ID = "+req.body.id+" ;"
    
    //console.log( sql )
    
    db.query(sql, datos, (err, data) => {
        if(err) {
            console.error("sp_Update_EstadoProyecto: ", err);            
            return res.json("API: " + err);
        }

        //res.send(res.json(data)); html
        //console.log(data);
        return res.json(data);
    })    
});

// DELETE Proyecto
app.delete( '/api/qa/proyecto',[
    body('id').notEmpty().withMessage('El parametro Proyecto_Id es obligatorio'),
],  async(req,res) => {
    console.log('--------------------------------------------------------------')
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log('proyecto ',errors.array())
        return res.status(400).json({ errors: errors.array() });
    }
    
    try {
        const sql = "call sp_Delete_Proyecto ('"+req.body.id+"' );";
        console.log(sql)
        const result = db.query(sql, (err, data) => {
            if(err) {
                console.error(err)
                return res.json("MySQL: "+err);
            }
            //res.send(res.json(data));        
            //console.log('Row(s): '+data.length);
            console.log('sp_Delete_Proyecto',data);
            return res.json(data);
        })          
    }
    catch(error) {
        console.error('sp_Delete_Proyecto: ',error);        
        return res.json(error);
        //return res.status(500).json(error);
    } 
} );

// Insert
app.post( '/api/qa/proyecto' , async (req, res) => {    
    console.log(req.body);
    const proy ={
        proyectoId: req.body.proyectoId,
        nombre: req.body.proyName,
        userCreated: req.body.user,
        created: req.body.created,
        estado: req.body.estado        
    };
    
    const sql = "call sp_Insert_Proyecto ('" +
    //req.body.proyectoId + ", '" + AUTOINCREMENT
    req.body.proyName + "', '" +
    req.body.user + "', '" +
    req.body.created + "', '" + //"',now(),'" + 
    req.body.estado + //"');"
    "', @proyectoId);";
    
    console.log('sp_Insert_Proyecto', sql )
    
    db.query(sql, (err, data) => {
        if(err) {
            console.error("sp_Insert_Proyecto: ",err);
            // console.error(err);
            return res.json("API Error: " + err);
        }
        //res.send(res.json(data));
        //console.log(data);
       
        console.log('proyectoId: ', data[0][0].proyectoId);

        return res.json(data[0][0].proyectoId);
    })    
});

// GetAll proyecto
app.get( '/api/qa/proyectos' , (req, res) => {    
    const sql = "call sp_SelectAll_Proyectos";
    const result = db.query(sql, (err, data) => {
        if(err) return res.json("Error API: "+err);
        //res.send(res.json(data));        
        // console.log('sp_SelectAll_Proyectos: '+data);
        // console.log(data[0]);
        return res.json(data[0]);
    })     
});

// Get Proyecto by Id
app.get( '/api/qa/proyecto/:id' , (req, res) => {        
    console.log('-----------------------------------------------------------')
    const sql = "call sp_select_proyecto (" + req.params.id + "); ";
    db.query(sql, (err, data) => {
        if(err) {
            console.error('sp_select_proyecto: ',err);
            return res.json("Error API: "+err);
        }
        // res.send(res.json(data));
        // console.log(data);
        return res.json(data[0]);
    })    
});

//::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
// STORAGE SETTINGS
//::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

const upload = multer({
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
          cb(null, 'uploads/'); // Carpeta donde se guardarán los archivos
        },
        filename: (req, file, cb) => {
          cb(null,  Date.now() + '-' + file.originalname); // Nombre en la base de datos
        }
    })
});

// UPLOAD
app.post('/api/upload', upload.single('file'), (req, res) => {
    if( req.file == undefined )
    {
        console.log("Attach... Error!"); // Información sobre el archivo subido
        res.send('Attach... Error!');
    }
    else
    {
        console.log('Attached:');
        console.log(req.file); // Información sobre el archivo subido
        res.send(req.file.filename); // devuelve la respuesta al frontend
    } 
});

//::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
// ESTADOS
//::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

// GetAll Estados
app.get( '/api/qa/estados' , (req, res) => {    
    
    const sql = "call sp_SelectAll_Estados";

    const result = db.query(sql, (err, data) => {
        if(err) return res.json("Error API: " + err);
        //res.send(res.json(data));        
        //console.log('Row(s): '+data.length);
        //console.log(data[0]);
        return res.json(data[0]);
    })     
});

//::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
// CATALOGOS
//::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

// GetAll Catalogos
app.get( '/api/qa/catalogos' , (req, res) => {    
    
    const sql = "call sp_SelectAll_Catalogos()";

    const result = db.query(sql, (err, data) => {
        if(err) return res.json("Error API: " + err);
        //res.send(res.json(data));        
        //console.log('Row(s): '+data.length);
        //console.log(data[0]);
        return res.json(data[0]);
    })     
});

// Get By Tipo
app.get( '/api/qa/catalogo/:tipo' , (req, res) => {    
    
    const sql = "call sp_Select_Catalogo ('"+req.params.tipo+"')";

    const result = db.query(sql, (err, data) => {
        if(err) return res.json("Error API: " + err);
        //res.send(res.json(data));        
        //console.log('Row(s): '+data.length);
        //console.log(data[0]);
        return res.json(data[0]);
    })     
});

//::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
// ROLES
//::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

// GetAll ROLES
app.get( '/api/qa/roles', async (req, res) => {    
    const sql = "call sp_SelectAll_Roles";
    const result = db.query(sql, (err, data) => {
        if(err) return res.json("Error API: "+err);
        //res.send(res.json(data));        
        //console.log('Row(s): '+data.length);
        console.log(data);
        return res.json(data[0]);
    })      
});

//----------------------------------------------------------------------
// USUARIOS
//----------------------------------------------------------------------

// UPDATE
app.put( '/api/qa/user', [
    body('userName').notEmpty().withMessage('El parametro userName es obligatorio'),
    body('fullName').notEmpty().withMessage('El parametro fullName es obligatorio'),    
    body('email').notEmpty().withMessage('El parametro email es obligatorio'),
    body('estado').notEmpty().withMessage('El parametro estado es obligatorio'),
    body('rol_id').isNumeric().withMessage('El parametro rol_id es obligatorio'),
    body('pwd').notEmpty().withMessage('El parametro pwd es obligatorio'),
    //body('created').isDate().withMessage('El parametro created es obligatorio'),
    //body('userCreated').notEmpty().withMessage('El parametro userCreated es obligatorio')
], 
async (req, res) => {  
    console.log('-----------------------------------------------------------------------');
    
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        console.log(errors.array())
        return res.status(400).json({ errors: errors.array() });
    }
    
    const datos = [
        req.body.userName,
        req.body.fullName,
        req.body.email,        
        req.body.estado,
        req.body.rol_id,
        req.body.pwd,
    ];        
    //console.log( datos );
    const script = "call sp_Update_Usuario ( ?,?, ?,?, ?,? )"; // 6 parametros

    const output = db.execute(script, datos, (err, data) => {         
        if(err) {
            console.error("API sp_Update_Usuario:",err);
            return res.json("API: " + err);
        }
        // res.send(res.json(data));
        console.log('sp_Update_Usuario',data);
        return res.json(1);
    });
});

// GET
app.get( '/api/qa/user/:username' , (req, res) => {        
    //console.log('user: ' + req.params.username);
    //const sql = "SELECT * FROM USUARIOS where username='" + req.params.username + "'";
    // con select no muestra data adicional 
    
    const sql = "call sp_select_usuario ('" + req.params.username + "')";
    db.query(sql, (err, data) => {
        if(err) return res.json("Error API: "+err);
        // res.send(res.json(data));
        // console.log(data);
        return res.json(data[0]);
    })    
});

// DELETE USER
app.delete( '/api/qa/user/:userName', [
    body('userName').notEmpty().withMessage('El parametro userName es obligatorio'),
], async (req, res) => {    
    console.log('--------------------------------------------------------------')
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log(errors.array())
        return res.status(400).json({ errors: errors.array() });
    }
    
    try {
        const sql = "DELETE FROM USUARIOS WHERE username = '"+req.body.userName+"' ;";
        console.log(sql)
        const result = db.query(sql, (err, data) => {
            if(err) return res.json("Error API: "+err);
            //res.send(res.json(data));        
            //console.log('Row(s): '+data.length);
            console.log(data);
            return res.json(data);
        })          
    }
    catch(error) {
        console.log('Endpoint error...');
        console.log(error);
        return res.json(error);
        //return res.status(500).json(error);
    } 
});

// INSERT
app.post( '/api/qa/user', [
    body('userName').notEmpty().withMessage('El parametro userName es obligatorio'),
    body('fullName').notEmpty().withMessage('El parametro fullName es obligatorio'),    
    body('email').notEmpty().withMessage('El parametro email es obligatorio'),    
    body('estado').notEmpty().withMessage('El parametro estado es obligatorio'),
    body('rol_id').isNumeric().withMessage('El parametro rol_id es obligatorio'),
    body('pwd').notEmpty().withMessage('El parametro pwd es obligatorio'),
    //body('created').isDate().withMessage('El parametro created es obligatorio'),
    //body('userCreated').notEmpty().withMessage('El parametro userCreated es obligatorio')
], 
async (req, res) => {  
    console.log('-----------------------------------------------------------------------');
    
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        console.log(errors.array())
        return res.status(400).json({ errors: errors.array() });
    }
    
    const datos = [
        req.body.userName,
        req.body.fullName,
        req.body.email,        
        req.body.estado,
        req.body.rol_id,
        req.body.pwd,
    ];        
    //console.log( datos );
    const script = "call sp_Insert_Usuario ( ?,?, ?,?, ?,? )"; // 6 parametros

    const output = db.execute(script, datos, (err, data) => {         
        if(err) {
            console.error("API:",err);
            return res.json("API: " + err);
        }
        // res.send(res.json(data));
        console.log(data);
        return res.json(data);
    });
});

// Usuarios GetAll
app.get( '/api/qa/users' , (req, res) => {    
    const sql = "call sp_SelectAll_Usuarios";
    const result = db.query(sql, (err, data) => {
        if(err) return res.json("Error API sp_SelectAll_Usuarios: "+err);
        //res.send(res.json(data));        
        //console.log('Row(s): '+data.length);
        // console.log(data);
        return res.json(data[0]);
    })     
});




// Login
app.get( '/api/qa/login/:username/:pwd' , (req, res) => {        
    console.log('user: ' + req.params.username);
    const sql = "SELECT Username,Fullname,Rol_Id,Estado FROM USUARIOS where username='" + req.params.username + "' and pwd='"+ req.params.pwd +"'";
    db.query(sql, (err, data) => {

        if(err) return res.json("Error API: "+err);
        
        console.log('data: ',data); // Imprime los datos de la respuesta

        if( data.length > 0 ) {
            console.log('data: ',data); // Imprime los datos de la respuesta
            //res.send(res.json(data));
            return res.json(data);
        }
        else{
            return res.json("NO RECORD!");            
        }        
    })    
});


/*************************************************************
 * Escuchar peticiones
 *************************************************************/

//const port = process.env.port || 8081;
const server = app.listen(8081, () => {
    console.log("Escuchando peticiones.");
});



// Finalizar conexión a MySQL
//db.end();



/*
server.close(() => {
    console.log('Servidor cerrado');
  });
*/

/*
signalExit((code, signal) => {
    console.log('Recibiendo señal:', signal);
    server.close(() => {
      console.log('Servidor cerrado');
    });
  });
*/