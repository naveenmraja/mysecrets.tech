import {createLogger, format, transports} from "winston";
import fs from 'fs'

const logDir = '/logs';

if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, {recursive: true});
}
export const log = createLogger({
    format: format.combine(
        format.timestamp(),
        format.printf(info => `${info.timestamp} ${info.level}: ${info.message}` + (info.splat !== undefined ? `${info.splat}` : " "))
    ),
    transports: [
        new transports.Console(),
        new transports.File({filename: '/logs/server.log'})
    ]
});