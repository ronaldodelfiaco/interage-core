const db = require("../config/database");


exports.checkToken =  async  (idUsuario, token ) => {


  if (!idUsuario) return {result: false, message: 'id do usuário não informado!'} ;
  if (!token) return {result: false, message: 'token do usuario não informado!'};

  let sql = `SELECT id_usuario, token_access from historico_login
  where token_access='${token}' AND ativo=true`

  var  { rows }  = await db.query( sql );

  if (rows.length < 1 ) return {result: false, message: 'Token não é válido!'}
  
  if (rows[0].id_usuario != idUsuario) return {result: false, message: 'Token não compativel!'}
  
  return {result: true, message: 'Token ok!'}
  
  }