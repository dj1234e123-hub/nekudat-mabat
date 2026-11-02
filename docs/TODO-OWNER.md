# שני דברים שממתינים לבעל הפרויקט (על המחשב)

עד שייעשו: מספרי הצפיות באתר נשארים כפי שהיו ב-2.11.2026, ואין בנייה אוטומטית יומית. האתר עובד תקין גם בלעדיהם.

## 1. מפתח קריאה ב-PostHog ← Vercel (ספירת הצפיות)

1. PostHog ← Settings ← Personal API keys ← Create. הרשאה: **Query: Read** בלבד, על פרויקט 581088.
2. Vercel ← פרויקט `nekudat-mabat-site` ← Settings ← Environment Variables. להוסיף, לסביבת Production:
   - `POSTHOG_PERSONAL_API_KEY` = המפתח
   - `POSTHOG_PROJECT_ID` = `581088`
3. לא להדביק את המפתח בצ'אט או בריפו.

מה זה נותן: `scripts/fetch-views.mjs` (רץ לפני כל בנייה) מעדכן את `src/data/views.json`. בלי מפתח הוא משאיר את הצילום האחרון והבנייה לא נכשלת.

## 2. Deploy Hook ← GitHub (בנייה יומית אוטומטית)

1. Vercel ← פרויקט `nekudat-mabat-site` ← Settings ← Git ← Deploy Hooks. ליצור hook על הענף `nekudat-mabat`, ולהעתיק את הכתובת.
2. GitHub ← הריפו ← Settings ← Secrets and variables ← Actions ← New repository secret:
   - שם: `VERCEL_DEPLOY_HOOK_URL`
   - ערך: הכתובת מהשלב הקודם

מה זה נותן: `.github/workflows/daily-build.yml` מפעיל בנייה פעם ביום, כך שהצפיות מתעדכנות גם כשלא נדחף תוכן.

## אחרי ששניהם נעשו

לומר לסשן "עשיתי". הוא יאמת שהצפיות מתעדכנות ויסגור את הסעיף בקובץ הזה וב-CLAUDE.md (שלב 4.101).
