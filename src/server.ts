import app from "./app"
import config from "./config"





const main = async () => {
    // console.log(config.database)
    app.listen(config.port, () => {
console.log(`server is raining ${config.port}`)
    })

}

main()