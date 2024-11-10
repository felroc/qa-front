
const Revision = () =>{

    return (
        
	<div class="container" method="post" action="home.php">

        <h1 class="label-form form-group ">
            <center>

                <a href="#">Revisión del Proceso QA</a>
            </center>
        </h1>

        <div name="revisor" class="row form-group">

            <div class="col-lg-1 col-md-1 col-sm-1 col-xs-1 col-lg-offset-6 col-md-offset-6 col-sm-offset-6 col-xs-offset-6">
                <label class="control-label">Analista Revisor</label>
            </div>

            <div class="col-lg-3 col-md-3 col-sm-3 col-xs-3">
                <input type="text" name="revisor" class="form-control" readonly="readonly" />
            </div>

            <div class="col-lg-1 col-md-1 col-sm-1 col-xs-1">
                <label class="control-label">Estado</label>
            </div>

            <div class="col-lg-1 col-md-1 col-sm-1 col-xs-1">
                <input type="text" name="estado" class="form-control" value='10' readonly="readonly" />
            </div>
        </div>

   

        <div class="panel-group">
            <div class="panel panel-primary">
                <div class="panel-heading">
                    <a class="sub-seccion" data-toggle="collapse" data-target="#sub5">Revisión del Checklist de Pruebas</a>
                </div>        

                <div className="contenedor">
                {/* border="1" cellpadding="10" cellspacing="0" style="width: 100%; max-width: 1200px; text-align: center;" */}
                    <table >
                    <thead>
                        <tr>
                        <th>Checklist</th>
                        <th>Revisión</th>
                        <th>Fecha</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                        <td>Pruebas de Negocio</td>
                        <td><input type="checkbox"/></td>
                        <td><input type="date"/></td>
                        </tr>
                        <tr>
                        <td>Pruebas del Desarrollo</td>
                        <td><input type="checkbox"/></td>
                        <td><input type="date"/></td>
                        </tr>
                        <tr>
                        <td>Set de Pruebas de QA</td>
                        <td><input type="checkbox"/></td>
                        <td><input type="date"/></td>
                        </tr>
                        <tr>
                        <td>Pruebas de Integración</td>
                        <td><input type="checkbox"/></td>
                        <td><input type="date"/></td>
                        </tr>
                        <tr>
                        <td>Pruebas Standard Internacional</td>
                        <td><input type="checkbox"/></td>
                        <td><input type="date"/></td>
                        </tr>
                        <tr>
                        <td>Pruebas de Certificación</td>
                        <td><input type="checkbox"/></td>
                        <td><input type="date"/></td>
                        </tr>
                        <tr>
                        <td>Pruebas de Liberación a Producción</td>
                        <td><input type="checkbox"/></td>
                        <td><input type="date"/></td>
                        </tr>
                    </tbody>
                    </table>
                </div>                  
            </div>
        </div>

    </div>

    )
}

export default Revision;