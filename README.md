# IoT Home Automation System
# Proiectul a fost lucrat si testat pe Intellij IDEA 2024.3.5 versiunea premium, cu java 21 si spring boot cu maven!!

**IoT Home Automation System** este o aplicatie care simuleaza un sistem inteligent de automatizare a locuintei. Scopul aplicatiei este de a oferi functionalitati complete pentru controlul si monitorizarea dispozitivelor smart (precum termostate, lumini, senzori etc.).

Totul a fost lucrat pe windows 11. Am folosit docker desktop ca server.

Dupa ce am deschis docker desktop, e nevoie de **docker compose up -d** din terminalul proiectului.

Apoi rulam aplicatia spring boot din intellij.

# Etapa II - Baza de date si Audit

### Baza de date

- Tip: MariaDB
- Acces prin: `JdbcTemplate`
- Configurare: application.properties + docker-compose
- Toate tabelele folosesc `user_id` ca foreign key pentru a izola datele per utilizator

### DAO + servicii cu JdbcTemplate

- `UserDAO` si `UserService`
- `SmartThermostatDAO` si `SmartThermostatService`
- `SmartSensorDAO`, `SmartCameraDAO`, `SmartCurtainsDAO`, `SmartSprinklerDAO`, `SmartHubDAO`, `SmartAssistantDAO`
- Fiecare DAO are: `findById`, `findAll`, `save`, `update`, `delete`
- Fiecare service prelucreaza obiectul si face validari suplimentare

### Audit

- Fiecare actiune de tip POST, PUT sau DELETE in sistem apeleaza manual `AuditService.log(...)`
- Linia scrisa in CSV are: actiune, timestamp, IP
- Fisierul este `audit.csv`, actualizat incremental cu FileWriter append
- Exemplu: `Login success for user: dumrares1@gmail.com from IP: 127.0.0.1,2025-05-29T15:21:24.065707700`
- IP-ul este obtinut prin `IpUtil.get()`
- Auditul este folosit in toate controller-ele (cam 50+ apeluri deja)

### Operatii CRUD

Pentru fiecare entitate (SmartThermostat, SmartCamera, etc.):

- **Create** – `/api/entity` (POST JSON)
- **Read** – `/api/entity` (GET lista) si `/api/entity/{id}`
- **Update** – `/api/entity/{id}/updateField?value=...` (POST)
- **Delete** – `/api/entity/{id}` (DELETE)

Acestea sunt implementate pe fiecare controller separat.

### Alte operatii personalizate

- Trimiterea unui email de confirmare la crearea contului (de obicei se afla in spam din pacate)
- `checkExpiredItems()` – doar pentru `SmartRefrigerator`, verifica daca exista produse expirate in inventar
- `togglePower()` – generic pentru toate device-urile smart
- `processVoiceCommand()` – pentru SmartAssistant (interpretare basic comanda text)
etc.

---

# Etapa I

## Functionalitati (10 dintre cele mai importante)
- **Crearea de obiecte smart** – Adaugarea unui obiect nou in sistem printr-un formular sau API (mai rapid pt etapa 1, la etapa 2 o sa extind a.i sa ma conectez direct la obiectele fizice).
- **Listarea obiectelor** – Afisarea tuturor obiectelor existente de un anumit tip.
- **Stergere** – Eliminarea unui obiect din sistem (soft/hard delete).
- **Activare/Dezactivare** – Pornirea sau oprirea componentelor.
- **Interactiuni speciale** – Actiuni specifice contextului (ex: modificarea temperaturii unui termostat sau trimiterea unui mesaj catre o camera).
- **Sincronizare cu ThingsBoard** – Trimiterea sau primirea datelor de la platforma IoT externa.
- **Generarea unui token de acces** – Crearea unui token JWT pentru autentificarea utilizatorului, cu o sesiune valabila de 1 luna.
- **Verificarea starii unui dispozitiv** – Verificarea in timp real a statusului (online/offline, temperatura actuala etc.).
- **Autentificare si inregistrare** – Procesul prin care utilizatorii isi creeaza cont si se logheaza pentru a folosi aplicatia. (altfel, nu au acces)
- **Operatii CRUD in baza de date** – Create, Read, Update si Delete pe obiecte.

## Obiecte curente

In aplicatie sunt definite mai multe tipuri de obiecte, printre care avem:

1. `Audit` - Adnotare pentru log personalizat
2. `AuditService` - Scriere in audit.csv cu timestamp si IP, manual prin apel explicit la `log(...)`
3. `CustomUserDetailsService` - Datele utilizatorului curent pentru spring security
4. `JwtAuthFilter` - Filtrarea token-ului JWT
5. `JwtUtil` - Generare si validare JWT
6. `SecurityConfig` - Configurare spring security
7. `AuthController` - Login / register
8. `PageController` - Thymeleaf routing
9. `Smart*Controller` - Controlere pentru toate dispozitivele smart
10. `Smart*DAO` - Acces JDBC la fiecare entitate
11. `UserDAO` + `User` - Utilizatori
12. `Smart*` - Modele pentru fiecare device
13. `EmailService` - Simulare trimitere email
14. `StatisticsService` - Pentru etapa III
15. `ThingsBoardService` - Push date catre dashboard ThingsBoard
16. `UserService` - Logica utilizator
17. `Smart*Service` - Servicii per entitate cu apeluri spre DAO

## Colectii

- `TreeMap<LocalDate, List<String>>` - Produse cu expirare (frigider)
- `Map<String, SmartDevice>` - Device-uri in Hub
- `List<String> eventLog` – log local pe obiecte
- etc.

## Mostenire

- De exemplu, nterfata `SmartDevice` este implementata de toate clasele smart: light, plug, camera, etc.
