# Variables de entornos para los clientes de integración

Modelo de variables de entorno para diferentes proyectos

las variables que cambian en función al documento sector son: `ISI_BASE_URL, ISI_API_URL, ISI_DOCUMENTO_SECTOR, ISI_TITLE `

1. .env.integrate

   ```bash
   APP_ENV=production
   
   ISI_BASE_URL=fcv.isipass.net
   ISI_API_URL=https://api.isipass.com.bo/api
   
   ISI_DOCUMENTO_SECTOR=1
   ISI_CAPTCHA_KEY=0x4AAAAAAAIcp-nx8ps0Ynbv
   ISI_TITLE="MÓDULO DE ADMINISTRACION"
   
   #### INTEGRATE ISI.INVOICE
   ISI_ASSETS_URL=/assets/images/integrate
   ISI_FONDO=/assets/images/integrate/fondo-login.jpg
   ISI_LOGO_FULL=/assets/images/integrate/logo.png
   ISI_LOGO_MINI=/assets/images/integrate/logo-mini.png
   ISI_NOMBRE_COMERCIAL=ISI.INVOICE
   ISI_URL=https://integrate.com.bo
   ISI_FAVICON=/assets/images/integrate/favicon.ico
   ISI_THEME=blue1
   # green, blue, blue1, purple, indigo, default,
   ```

2. .env.sandbox

   ```bash
   APP_ENV=production
   
   ISI_BASE_URL=dev.fcv.isipass.com.bo
   ISI_API_URL=https://sandbox.isipass.net/api
   
   ISI_DOCUMENTO_SECTOR=1
   ISI_CAPTCHA_KEY=0x4AAAAAAAIR3qJWMFMaFVXX
   ISI_TITLE="MÓDULO DE ADMINISTRACION"
   
   #### INTEGRATE SANDBOX
   ISI_ASSETS_URL=/assets/images/integrate
   ISI_FONDO=/assets/images/integrate/fondo-login.jpg
   ISI_LOGO_FULL=/assets/images/integrate/logo.png
   ISI_LOGO_MINI=/assets/images/integrate/logo-mini.png
   ISI_NOMBRE_COMERCIAL=ISI.INVOICE
   ISI_URL=https://integrate.com.bo
   ISI_FAVICON=/assets/images/integrate/favicon.ico
   ISI_THEME=blue
   
   
   ```

3. .env.gosocket

   ```bash
   APP_ENV=production
   
   ISI_BASE_URL=fcv.gosocket.isipass.net
   ISI_API_URL=https://gosocket.isipass.net/api
   
   ISI_DOCUMENTO_SECTOR=1
   ISI_CAPTCHA_KEY=0x4AAAAAAAIcp-nx8ps0Ynbv
   ISI_TITLE="MÓDULO DE ADMINISTRACION"
   
   #### GOSOCKET
   ISI_ASSETS_URL=/assets/images/gosocket
   ISI_FONDO=/assets/images/gosocket/fondo-login.jpg
   ISI_LOGO_FULL=/assets/images/gosocket/logo.png
   ISI_LOGO_MINI=/assets/images/gosocket/logo-mini.png
   ISI_NOMBRE_COMERCIAL=GOSOCKET
   ISI_URL=https://gosocket.net
   ISI_FAVICON=/assets/images/gosocket/favicon.png
   ISI_THEME=green
   #green, blue, blue1, purple, indigo, default,
   
   ```

7. .env.pseing
   ```bash
   APP_ENV=production
   
   ISI_BASE_URL=fcv.pseing.com
   ISI_API_URL=https://fapi.pseing.com/api
   
   ISI_DOCUMENTO_SECTOR=1
   ISI_CAPTCHA_KEY=0x4AAAAAAAVtObcL8qQe-XhN
   ISI_TITLE="MÓDULO DE ADMINISTRACION"
   
   #### INTEGRATE ISI.INVOICE
   ISI_ASSETS_URL=/assets/images/pseing
   ISI_FONDO=/assets/images/pseing/fondo-login.webp
   ISI_LOGO_FULL=/assets/images/pseing/logo.png
   ISI_LOGO_MINI=/assets/images/pseing/logo-mini.png
   ISI_NOMBRE_COMERCIAL=EPSILON
   ISI_URL=https://pseing.com
   ISI_FAVICON=/assets/images/pseing/favicon.ico
   ISI_THEME=blue
   # green, blue, blue1, purple, indigo, default,
   
   ```
