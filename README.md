# 🛍️ Ecommerce - Shopmix

¡Bienvenido a **Shopmix**! 🚀 Un e-commerce completo desarrollado con **React.js**, **Node.js** y **SQL Server**.  
Este proyecto permite a los usuarios explorar productos, agregarlos al carrito y realizar compras en línea.

---

## 📸 Capturas de pantalla  
(imágenes, : `![Descripción](ruta/imagen.png)`)

---

## 🛠️ Tecnologías utilizadas

### **Frontend (Cliente)**
- ⚛️ [React.js](https://react.dev/) - Framework de frontend  
- 🎨 [Tailwind CSS](https://tailwindcss.com/) - Estilización  
- 🔄 [Redux](https://redux.js.org/) - Manejo de estado  
- 🛒 PrimeReact - Componentes UI  

### **Backend (Servidor)**
- 🟢 [Node.js](https://nodejs.org/) - Entorno de ejecución  
- 🚀 [Express.js](https://expressjs.com/) - Framework backend  
- 🔒 JSON Web Token (JWT) - Autenticación  

### **Base de Datos**
- 🗄️ [SQL Server](https://www.microsoft.com/sql-server/) - Base de datos relacional  

---

## 🚀 Instalación y ejecución

### **1️⃣ Clonar el repositorio**
```sh
git clone https://github.com/JoseChinola/Ecommerce.git
cd Ecommerce
```

### **Configurar el archivo .env:**
```
cd backend
npm install
```

### **Configuración del Backend**
```
FRONTEND_URL=http://localhost:5173
PORT=3000
RESEND_API_KEY=your_resend_key_here
SECRETE_KEY_ACCESS_TOKEN=your_access_token_key_here
SECRETE_KEY_REFRESH_TOKEN=your_refresh_token_key_here
STRIPE_SECRET_KEY=your_stripe_secret_here
STRIPE_ENDPOINT_WEBHOOK_SECRET_KEY=your_webhook_secret_here
DB_USER=your_db_user
DBA_HOST=localhost
DB_PASSWORD=your_db_password
DB_NAME=your_db_name
EMAIL_USER=your_email
EMAIL_PASS=your_email_password
CLODINARY_CLOUD_NAME=your_cloud_name
CLODINARY_API_KEY=your_api_key
CLODINARY_API_SECRET_KEY=your_api_secret
```

### **Iniciar el servidor**
```
npm run dev
```
### **Configuración del Frontend**
```
npm run dev
cd ../frontend
npm install
```
