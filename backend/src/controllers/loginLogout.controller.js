const db = require("../config/database");


function generateTokenUserAcess() {
    return rand() + rand();
  
    function rand() {
      return Math.random().toString(36).substr(2);
    };
  };


exports.login =  async (req, res, next) => {

    
    // verific consistenct of parameters 
    if (!req.query.login || !req.query.senha){
        res.status(200).send({
            error: `Don't have the information`,
            });
        return
    }

    let sql = `SELECT u.*, pe.apelido_fantasia as apelido, ddd, telefone, '' as  permissoes, login as name, '' as avatar   
                from usuarios u
                inner join pessoas pe on u.id_pessoa = pe.id
                left join pessoas_telefones tel on pe.id = tel.id_pessoa and principal 
                where login = '${req.query.login}' `


    var  { rows }  = await db.query( sql );

    if (rows.length < 1 ) {
        res.status(200).send({
            error: `login not found`,
            });
        return
    }
    if (rows[0].senha != req.query.senha ) {
        res.status(200).send({
            error: `Error password `,
            });
        return
    }

    let usuarioLogado = rows[0];
    delete usuarioLogado.senha;
    delete usuarioLogado.login;
    

    // ler permissões do usuário

    sql = `select id_recursos::integer, rota
    from permissoes_departamento pd 
    inner join permissoes_recursos pr on pd.id_recursos = pr.id 
    where id_departamento = ${usuarioLogado.id_departamento}
    union 
    select id_recursos::integer, rota
    from permissoes_usuarios pu
    inner join permissoes_recursos pr on pu.id_recursos = pr.id 
    where id_usuario = ${usuarioLogado.id} `

    

    var   { rows }  = await db.query( sql );

    usuarioLogado.permissoes = rows

    

    sql = `insert into historico_login(id_usuario, ip, datahora,  ativo)
    VALUES ( ${usuarioLogado.id} , '${req.ip}', now(),  true ) RETURNING id`

    //console.log(sql)

    var  { rows}  = await db.query( sql );

   
    let id_historico_login = rows[0].id

    usuarioLogado.token =  String( id_historico_login )  + generateTokenUserAcess();

    sql = `UPDATE public.historico_login
	SET  token_access= '${usuarioLogado.token}'
    WHERE id = ${ id_historico_login } `
    
    var  { rows}  = await db.query( sql );

    res.status(200).send({
        message: `Login OK  `,
        body: {
            usuarioLogado 
        },
    });

};


exports.logout =  async (req, res, next) => {

    sql = `UPDATE public.historico_login set ativo=false 
	WHERE  token_access= '${req.query.token}' `
    
    var  { rows}  = await db.query( sql );

    res.status(200).send({
        message: `Logout OK  `,

    });

};
