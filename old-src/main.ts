import express from 'express';
import { HookController } from './controllers';
import { ConfigProvider } from "./services";

const app = express();

app.use(express.json());
app.post('/', HookController.dispatch);

const port = ConfigProvider.setup.app.port;
app.listen(port, () => console.log(`App listening on :${port}`));
