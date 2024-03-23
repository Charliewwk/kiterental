import jwt from 'jsonwebtoken';

const token = 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ0b21fZmVyQG1zbi5jb20iLCJpYXQiOjE3MDk5MTY2MDMsImV4cCI6MTcxMDAwMzAwM30.7CypMEywaw3Rb3XEWZetRIT-Y8__FezUzUheBGG…';
const secretString = "3453WTGW3G3435G23G43G435634H56G3F2F45H3G4G523F432F32G435G4G234F23G324G324G3G";

try {
  const decoded = jwt.verify(token, secretString);
  console.log(decoded);
} catch (error) {
  console.error('Error al decodificar el token:', error);
}