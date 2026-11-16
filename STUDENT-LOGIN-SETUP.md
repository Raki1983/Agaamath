# AGAA-MATH Student Login Update

This update adds a student ID + password sign-in page to the existing AGAA-MATH GitHub Pages PWA. Existing videos, worksheets, quizzes, calculator, logo and grade topics are retained.

## Firebase configuration included
The web app configuration supplied for Firebase project `agaa-math` is placed in `firebase-auth.js`. This is client-side configuration, not an Admin SDK credential. Never put a Firebase service-account JSON/private key in this website.

## How student sign-in works
- A student types their Student ID and password.
- The website converts the ID to a lowercase internal email alias: `<studentid>@students.agaamath.invalid`.
- Firebase Authentication checks the password.
- The website reads `students/{Firebase Authentication UID}` from Firestore.
- The profile must have `active: true` and `role: "student"`.
- The existing Firestore rules allow the authenticated user to read only the document whose ID is their own UID.

The `.invalid` suffix is intentionally not a real mailbox. Students do not receive email. Password reset must be performed by the teacher through Firebase Console for now.

## Important test account
The sample Firebase Authentication account created during setup is expected to be:
`student001@students.agaamath.invalid`

Its Firestore profile document ID must be the exact Firebase Authentication UID, and its fields must include:
- `studentId`: `STUDENT001` (string)
- `displayName`: `Test Student` (string)
- `grade`: `6` (integer)
- `role`: `student` (string)
- `active`: `true` (boolean)

The student must enter `STUDENT001` and the password set when the teacher created the sample Auth user. Do not put passwords in Firestore or source code.

## Upload to GitHub Pages
1. Download a backup of your current repository first.
2. Extract this ZIP on your computer.
3. Open the extracted `Agaamath-main` folder. It contains `index.html`, `styles.css`, `app.js`, `firebase-auth.js`, `service-worker.js`, manifest, assets and worksheets.
4. In GitHub, open repository `Raki1983/Agaamath` on branch `main`.
5. Upload/replace the files and folders from inside `Agaamath-main` into the repository root. Do not upload the enclosing folder as a nested directory.
6. Commit the changes to `main` and wait for GitHub Pages to publish.
7. Open `https://raki1983.github.io/Agaamath/` in a private/incognito browser window for the first test, or clear the site's cached data if the old version appears.

## Before real students use it
- Test the sample account first.
- Confirm the Firestore Rules tab shows the intended published rules.
- Create real accounts only from Firebase Authentication > Users > Add user, using the alias format above; create a matching Firestore profile with document ID equal to that account's UID.
- Never create a public student registration form.
- The current teacher workflow is manual in Firebase Console. A secure teacher dashboard for bulk account creation needs a trusted server/Admin SDK; never expose an Admin SDK key in GitHub Pages.
- Student quiz progress is not yet saved to Firestore. This update only authenticates students and displays their profile name and grade.

## Firebase Firestore rules expected
The current rules should include `allow get` only when `request.auth.uid == studentUid`, deny list/create/update/delete for student documents, and deny all other access. Do not enable public read/write rules.
