import app from "./app";

const main=()=>{
    app.listen(app.get('port'), ()=>{
        console.log(`Servidor on port ${app.get('port')}`);
    });
};

main();
