Generic CRUD

1 - Data Base Management System (DBMS): Only Postgres
          
2 - To make a filter use the "filter" or "id" parameter with its respective values, example: 
        id:  5
        id:  1050
        filter: id = 5
        filter: status = true
        filter: name like 'A% *'
    Obs.: if there is the parameter "id" the parameter "filter" it will be descarded 

3 - Use the parameter filter for: get, put e delete 

4 - The body pathern x-www-form-urlencoded 




