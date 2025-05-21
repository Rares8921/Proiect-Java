# IoT Home Automation System
# Proiectul a fost lucrat si testat pe Intellij IDEA 2024.3.5 versiunea premium, cu java 21 si spring boot cu maven!!

**IoT Home Automation System** este o aplicatie care simuleaza un sistem inteligent de automatizare a locuintei. Scopul aplicatiei este de a oferi functionalitati complete pentru controlul si monitorizarea dispozitivelor smart (precum termostate, lumini, senzori etc.).

## Functionalitati (10 dintre cele mai importante + TODO-uri care sunt aproape gata)
- **Crearea de obiecte smart** – Adaugarea unui obiect nou in sistem printr-un formular sau API (mai rapid pt etapa 1, la etapa 2 o sa extind a.i sa ma conectez direct la obiectele fizice).
- **Listarea obiectelor** – Afisarea tuturor obiectelor existente de un anumit tip.
- **Stergere** – Eliminarea unui obiect din sistem (soft/hard delete).
- **Activare/Dezactivare** – Pornirea sau oprirea componentelor.
- **Interactiuni speciale** – Actiuni specifice contextului (ex: modificarea temperaturii unui termostat sau trimiterea unui mesaj catre o camera).
- **Sincronizare cu ThingsBoard** – Trimiterea sau primirea datelor de la platforma IoT externa.
- **TODO: Task-uri automate** – Setarea unor scenarii programate (ex: aprindere bec la ora X, reducere temperatura noaptea).
- **TODO: Resetare la configuratia implicita** – Revenirea la valorile standard ale dispozitivului.
- **Generarea unui token de acces** – Crearea unui token JWT pentru autentificarea utilizatorului, cu o sesiune valabila de 1 luna.
- **Verificarea starii unui dispozitiv** – Verificarea in timp real a statusului (online/offline, temperatura actuala etc.).
- **Autentificare si inregistrare** – Procesul prin care utilizatorii isi creeaza cont si se logheaza pentru a folosi aplicatia. (altfel, nu au acces)
- **TODO: Validare cont prin email** – Activarea contului utilizatorului doar dupa confirmarea adresei de email.
- **TODO: Filtrare dupa proprietar** – Afisarea obiectelor detinute doar de un anumit utilizator.
- **Operatii CRUD in baza de date** – Create, Read, Update si Delete pe obiecte.
etc. 

## Obiecte curente

In aplicatie sunt definite mai multe tipuri de obiecte, printre care avem:

1. `Audit` - Pentru adnotarea custom
2. `AudiAspect` - Preluam adnotarea si rulam actiunea ei, apoi continuam cu functia care avea adnotarea
3. `CustomUserDetailsService` - Preluam datele utilizatorului curent pentru serviciul de  security.
4. `JwtAuthFilter` - Filtrarea token-ului + linkarea cu security
5. `JwtUtil` - Generarea de token JWT
6. `SecurityConfig` - Adaugam filtrare, blocam rute pentru useri nelogati etc.
7. `AuthController` - Actiuni de register, verify si elogin
8. `PageController` - Sistem de rutare bazat pe thymeleaf
9. `SmartAlarmSystemController` + alte controllere asemanatoare celorlalte obiecte
10. `SmartAlarmSystemDAO` + restul de DAO-uri pentru toate obiectele
11. `UserDAO` si `User` - se inteleg de la sine
12. `SmartAlarmSystem`, `SmartAssistant`, `SmartCamera` etc.
13. `AuditService` - service-ul pentru sistemul de log-uri
14. `EmailService` - trimitem mail-uri de confirmare dupa ce se inregistreaza userii (macar in teorie)
15. `StatisticsService` - aici vom face diverse statistici legate de obiecte
16. `ThingsBoardService` - conectivitatea cu o platforma iot, pt ca momentan nu am obiectele fizice sa testez
17. `UserService` - diverse functii pentru informatii despre useri
18. `SmartAlarmSystemService` + restul de servicii pentru fiecare obiect smart in parte

## Colectii

- `TreeMap<LocalDate, List<String>>` - pentru o data anune, stocam id-uri ale produselor
- `Map<String, SmartDevice>` - identificarea dispozitivelor din hub
- `List<String> eventLog;` – pentru serviciul de audit
- etc.

## Mostenire

- De exemplu, `SmartDevice` este o clasa abstracta pentru `SmartThermostat`, `SmartLight`, etc. (basically pentru toate obiectele)

# Etapa II - Baza de date
Baza de date relationala folosita este **MariaDB**, prin jdbc si docker. Config-urile pentru ea se afla in docker-compose si application.properites (am postat doar partile din file care exemplificau acest lucru)

**DAO + servicii cu JdbcTemplate (si am crud pe fiecare dintre ele):**
- `UserDAO` si `UserService`
- `SmartThermostatDAO` si `SmartThermostatService`
- `SmartSensorDAO` si `SmartSensorService`
- `SmartCameraDAO` si `SmartCameraService`
- `SmartSprinklerDAO` si `SmartSprinklerService`
- `SmartHubDAO` si `SmartHubService`
etc.


**Servicii singleton:**
- Am implementat toate serviciile prin `@Service` Spring, ceea ce le face singleton by default


**Audit (partial):**

- Clasele `Audit`, `AuditSpect`, `AuditService` ce se ocupa cu crearea de adnotari pentru log-uri si salvarea in csv (nu e completa functionalitatea)
