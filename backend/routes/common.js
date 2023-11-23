//import { Router } from "express";

//const router = Router();
const createCommonRoutes = (app) => {
    app.post('/about', async (req, res) => {  
        res.send('This is About page data from server').status(200)
      });
    
}

export default createCommonRoutes;
  