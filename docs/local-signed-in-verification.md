# Local signed-in verification

On November 27, 2026, Chromium exercised PawVerdi's Next.js development server against a disposable loopback PostgreSQL 19 database, GoTrue and PostgREST 16.6. The test created an email-confirmed user in local GoTrue and assigned the admin role in its matching profile. Signing in through the site's password form established the browser session. The database and all application services were local. Credentials were generated for the run.

| Check | Observed result |
| --- | --- |
| Database bootstrap | GoTrue started and all five application migrations applied. |
| Contact inquiry | The public contact endpoint returned HTTP 200 with stored true. A database query found the submitted message in the new state. |
| Protected route | A signed-out request to the publishing desk redirected to sign-in. |
| Staff authentication | The browser submitted the password form and loaded the publishing desk with the expected email and admin role. |
| Inbox | The inquiry appeared in the contact queue. Submitting its status form changed the database record to triaged. |
| Editorial workflow | The admin created a product draft through the publishing form and moved it through review, publication and archiving. PostgreSQL confirmed each resulting state. |
| Anonymous access | Anonymous PostgREST reads returned no record in draft, review or archived state and one record when published. |
| Sign-out | The browser submitted the sign-out form. A subsequent publishing desk request redirected to sign-in. |

The browser submitted native HTML forms with JavaScript disabled. PostgREST and GoTrue ran behind a private prefix router. The media migration used minimal local storage bucket and object tables. This run covered SQL policy installation, while hosted Storage object transfer, production DNS, mail delivery and deployed authentication settings require separate verification.
