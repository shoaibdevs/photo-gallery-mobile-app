import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, ScrollView, Image } from 'react-native';
import { colors } from '../../colors'
import Modal from 'react-native-modal';
import {  useDispatch } from 'react-redux'
import { setPopupTerms } from '../../redux'
import { VerticalSpace } from '../../utilities/verticalSpace'

const width = Dimensions.get('window').width;

export default function PopupTerms(props) {
    const dispatch = useDispatch()
    const { popupTerms } = props
    const [isButtonEnabled, setIsButtonEnabled] = React.useState(true);


    const handleScroll = (event) => {
        const scrollOffsetY = event.nativeEvent.contentOffset.y;
        const scrollViewHeight = event.nativeEvent.layoutMeasurement.height;
        const scrollContentSizeHeight = event.nativeEvent.contentSize.height;
      
        if (scrollOffsetY + scrollViewHeight >= scrollContentSizeHeight) {
          setIsButtonEnabled(false);
        }else{
          setIsButtonEnabled(true);
        }
      };
    return (
        <View>
            <Modal animationOutTiming={500} animationInTiming={500} backdropOpacity={1} backdropColor={'rgb(220,219,223)'} isVisible={popupTerms}>
                <View style={styles.modal}>
                    <TouchableOpacity disabled={isButtonEnabled} onPress={() => dispatch(setPopupTerms(false))} style={{ alignSelf: 'flex-end' }} >
                        <Image source={require('../../../assets/images/buttonsNavBar.png')} />
                    </TouchableOpacity>
                    <VerticalSpace height={0.02} />
                    <View style={styles.container}>
                        <ScrollView  onScroll={handleScroll} contentContainerStyle={{ width: '85%', alignSelf: 'center' }}>
                            <View style={styles.secondHeader}>
                                <VerticalSpace height={0.02} />
                                <Text style={styles.secondHeaderText}>{'תנאי השימוש'}</Text>
                                <Text style={styles.secondHeaderText}>{'והפרטיות'}</Text>
                                <VerticalSpace height={0.02} />
                                <Text style={styles.secondHeaderText}>{'מדיניות פרטיות'}</Text>
                            </View>
                            <View style={styles.paragrahBlock}>
                                <VerticalSpace height={0.02} />
                                <Text style={styles.paragrah}>
                                    {'פיק איט סימפל בע"מ ("החברה", "אנחנו" או "אנו") המספקת את האפליקציה ("האפליקציה"), מחויבת להגן על פרטיות משתמשי האפליקציה ("משתמש/ים" או "אתה"). מדיניות פרטיות זו ("מדיניות הפרטיות") נוצרה כדי ליידע אותך לגבי הדרך שבה אנו מנהלים, אוספים, מאחסנים ועושים שימוש במידע שאתה מספק לנו באמצעות האפליקציה. בנוסף, מדיניות הפרטיות שלהלן מתארת את האמצעים בהם אנו נוקטים על מנת להגן על בטיחותו של המידע הנאסף על ידנו וכיצד ניתן ליצור אתנו קשר בנוגע לנוהלי הפרטיות שלנו.'}
                                </Text>
                                <VerticalSpace height={0.02} />
                                <Text style={styles.paragrah}>
                                    {'מדיניות פרטיות זאת נכתבה בלשון זכר מטעמי נוחות בלבד, אך מיועד לנשים וגברים כאחד.'}
                                </Text>
                                <VerticalSpace height={0.02} />
                                <Text style={styles.paragrah}>
                                    {'אנא שים לב שהיקף מדיניות פרטיות זו מוגבל רק למידע שנאסף על-ידינו באמצעות השימוש שאתה עושה בשירותי האפליקציה שלנו (בין שהשימוש כאמור הוא באמצעות כל מחשב בו נעשה שימוש כדי לקבל גישה לשירותי האפליקציה, לרבות ללא הגבלה, מחשב נייח, מחשב נייד, טלפון נייד או כל מכשיר אלקטרוני אחר). באמצעות שימוש באפליקציה שלנו, אתה מסכים למדיניות הפרטיות שלנו.'}
                                </Text>
                                <VerticalSpace height={0.02} />
                                <Text style={styles.paragrah}>
                                    {'האפליקציה מאפשרת לבצע צילום חכם אשר מאגד תמונות שצולמו באמצעותה, לכדי אלבומים אישים או אלבומים הניתנים לשיתוף עם אחרים. כאשר מגיעים למכסת תמונות באלבום, האפליקציה מאפשרת לבצע הזמנה של עותק מודפס של האישי האלבום שנוצר במכשיר הנייד של המשתמש ("שירותי האפליקציה").'}
                                </Text>
                                <VerticalSpace height={0.02} />
                                <Text style={styles.paragrah}>
                                    {'בעת השימוש באפליקציה שלנו, אנו עשויים לאסוף ממך שני סוגי מידע עליך בקשר לשימושך בשירותי האפליקציה: "מידע אישי" – משמעו מידע עליך שניתן להשתמש בו על מנת ליצור עמך קשר או לזהות אותך. חלק מהמידע מזהה אותך באופן אישי, כגון שמך, כתובתך, דואר האלקטרוני שלך, מספר הטלפון שלך וכיו"ב. זהו המידע שאתה מוסר ביודעין, בהסכמתך, לטובת הרשמה ושימוש בשירותי האפליקציה. "מידע לא אישי" – משמעו מידע שכשלעצמו, לא מאפשר לעשות שימוש לשם זיהוי או יצירת קשר איתך. זהו מידע סטטיסטי ומצטבר. לדוגמה, העמודים בהם צפית באפליקציה ושירותי האפליקציה שעניינו אותך ועוד. אנו רשאים לאסוף מידע לא אישי ולהשתמש בו לכל מטרה באמצעות כל אחת מהשיטות לעיל וכן באופן אוטומטי או באופן אחר באמצעות השימוש שתעשה בשירותי האפליקציה.'}
                                </Text>
                                <VerticalSpace height={0.02} />
                                <Text style={styles.paragrah}>
                                    {'אינך מחויב לפי חוק למסור לנו את פרטי המידע האישי המתוארים להלן, אך לצורך השימוש בשירותי האפליקציה באופן המיטבי, הנך נדרש לשתף עם החברה את פרטי המידע האישי המפורטים. במידה ותסרב למסור חלק מהמידע האישי שלך, ייתכן ולא תוכל לעשות שימוש בשירותי האפליקציה או שתוכל לעשות שימוש חלקי בלבד.'}
                                </Text>

                                <VerticalSpace height={0.04} />
                                <Text style={styles.secondHeaderText}>
                                    {'כיצד אנו אוספים את המידע שלך?'}
                                </Text>
                                <VerticalSpace height={0.04} />
                                <Text style={styles.paragrah}>
                                    {'אנו אוספים מידע אישי ומידע לא אישי ממך, בין היתר, באמצעות השיטות הבאות:'}
                                </Text>
                                <VerticalSpace height={0.02} />
                                <Text style={styles.paragrah}>
                                    {'הרשמה לאפליקציה: כדי להירשם לשימוש בשירותי האפליקציה, יהיה עליך להזין שם מלא, כתובת דואר אלקטרוני, גיל, מצב משפחתי ומספר טלפון. לחלופין, אם תבחר להירשם באמצעות חשבון הפייסבוק, גוגל או אפל האישיים שלך, החברה תקבל הרשאה למידע שאותן פלטפורמות מאחסנות לגביך, בהתאם למדיניות הפרטיות שמוגדרת בהתקשרות בינך לבין פייסבוק, גוגל או אפל. המידע שאנו אוספים בשיטה זאת, כולל על פי רוב את שם המשתמש שלך, זיהוי המשתמש (user ID), כתובת דואר אלקטרוני ומידע ציבורי מהפרופיל שלך בחשבונות אלו. יצירת קשר: במידה ואתה מעוניין ליצור עמנו קשר, באפשרותך לעשות זאת באמצעות טופס פניה באפליקציה ואנו נאסוף את שמך המלא, כתובת דואר אלקטרוני, טלפון, נושא ותוכן הפניה שלך. רכישה באמצעות האפליקציה: במידה ואתה בוחר לבצע הזמנה של אלבום תמונות מודפס, אנו נאסוף מידע בנוגע לכתובת משלוח האלבום ופרטים ליצירת קשר. כמו כן, פרטי התשלום שלך יאספו באמצעות צד שלישי שיעבד פרטים אלו באופן מאובטח, בהתאם לסטנדרט הגבוה המקובל בשוק. מאגר תמונות: התמונות אותן אתה מצלם יישמרו באופן מאובטח בענן עד לביצוע הזמנת האלבום. במידה ולא תבצע הזמנת אלבום בתוך תקופה של 12 חודשים מרגע השלמת מכסת התמונות באלבום, אנו נמחק את התמונות לצמיתות מן הענן. שיתוף אלבומים: במידה ותבחר לשתף את אלבום התמונות שלך באפליקציה עם משתמשים אחרים, אנו נאסוף את רשימת אנשי הקשר השמורים אצלך במכשיר הנייד, ונאפשר למשתמשים האחרים לגשת לאלבום התמונות. כיצד אנו משתמשים בפרטים שלך?'}
                                </Text>

                                <VerticalSpace height={0.04} />
                                <Text style={styles.secondHeaderText}>
                                    {'אנו משתמשים בפרטים שנאספו ממך באופן הבא:'}
                                </Text>
                                <VerticalSpace height={0.04} />
                                <Text style={styles.paragrah}>
                                    {'ניהול המערכת ואספקת שירותי האפליקציה: אנו עשויים להשתמש במידע אישי ובמידע לא אישי על מנת לספק לך את השירותים ועל מנת לנהל, לתמוך, לפתור בעיות טכניות, להגן ולשפר את השירותים, לוודא תפעול נאות שלהם וכן למטרות יצירת קשר אתך.'}
                                </Text>
                                <VerticalSpace height={0.02} />
                                <Text style={styles.paragrah}>
                                    {"שליחת הודעות: אנו עשויים להשתמש במידע האישי על מנת לשלוח לך הודעות הקשורות לשירותים, ניהול מבצע או סקר, וכן לצורך מתן הוראות או עזרה הקשורות לשירותים ו/או לשימוש שלך באפליקציה. כמו כן, יתכן ונשתמש במידע האישי שלך לצורך משלוח ניוזלטר ועדכונים באמצעות הודעות פנימיות (in app notification), וכן באמצעות הודעות חיצוניות (Push Notification) לגבי פעילות החברה במידה ותאפשר זאת באמצעות האפליקציה. כל אימת שתעשה שימוש בשירותי האפליקציה, אנו רשאים להשתמש במידע האישי שלך על מנת להשלים כל פעולה רלוונטית דרושה וליצור אתך קשר בנוגע לשירותים. אם כן, אנו משתמשים בכתובת הדואר האלקטרוני שסיפקת כדי לשלוח לך מידע ועדכונים הנוגעים לשימושך בשירותי האפליקציה, תפעול המערכת וכד'. אם בשלב כלשהו תעדיף להסיר את עצמך מרשימת התפוצה, על מנת שלא לקבל הודעות מאתנו, הנך רשאי לעשות זאת בכל עת בהתאם להוראות המפורטות ביחס להסרה מרשימת התפוצה בתחתית כל הודעה שתקבל מאתנו."}
                                </Text>
                                <VerticalSpace height={0.02} />
                                <Text style={styles.paragrah}>
                                    {'צירוף מידע אנונימי: ככל המותר על פי הדין החל, אנו רשאים לצרף את סוגי הנתונים השונים שאנו אוספים ממך עם סוגי נתונים אחרים שאנו אוספים ממך. איסוף זה יתבצע באופן אנונימי ומצטבר ובצורה שלא מזהה אותך באופן אישי לרבות באמצעות העברת מידע שעבר גיבוב (“hashing”). מידע אנונימי, סטטיסטי או מצטבר זה, ישמש רק על מנת לשפר את המוצרים והשירותים שלנו. אם מידע לא אישי נאסף לצורך פעילות שדורשת גם מידע אישי, אנו רשאים לצרף את המידע הלא אישי שלך עם המידע האישי שלך בניסיון לספק לך חווית משתמש טובה יותר, לשפר את ערך ואיכות השירותים ולנתח כיצד נעשה שימוש בשירותי האפליקציה.'}
                                </Text>
                                <VerticalSpace height={0.02} />

                                <VerticalSpace height={0.04} />
                                <Text style={styles.secondHeaderText}>
                                    {'מסירת המידע האישי שלך'}
                                </Text>
                                <VerticalSpace height={0.04} />
                                <Text style={styles.paragrah}>
                                    {'אתה מבין ומסכים לכך שייתכן ונידרש למסור מידע אישי אם נידרש לכך על פי חוק או אם נהיה סבורים כי מסירה כאמור דרושה באופן סביר על מנת להימנע מחבות משפטית שלנו, לשם ציות להליכים משפטיים, לרבות, ומבלי לגרוע, זימון לדין, צו חיפוש או צו בית משפט, או על מנת להגן על רכוש וזכויות שלנו או של צד שלישי, להגן על בטיחות הציבור או של כל אדם, או למנוע או לעצור פעילות שנמצא שהיא בלתי חוקית, בלתי אתית או ברת תביעה או שיש סכנה שתהיה כזו.'}
                                </Text>
                                <VerticalSpace height={0.02} />
                                <Text style={styles.paragrah}>
                                    {'בכל הנוגע לשירותי האפליקציה כגון ביצוע רכישת אלבומים מודפסים, אנו נעביר את המידע האישי שלך לצדדים שלישיים הרלוונטיים בהתאם לרכישות שביצעת כגון חברת סליקה ובית דפוס. מלבד לאמור במדיניות פרטיות זו, המידע האישי שתספק לא יימסר, יושכר, יושאל, יוחכר, יימכר או יופץ לצדדים שלישיים (להוציא שותפים עסקיים ו/או צדדים אחרים המפורטים במדיניות פרטיות זו) ואנו לא נשתף את המידע האישי אודותיך עם צדדים שלישיים למטרות שיווק ללא רשותך, אלא כפי שמפורט בתנאי מדיניות פרטיות זו. אנו רשאים ועשויים לשכור חברות ויחידים שהם צדדים שלישיים על מנת לסייע בביצוע שירותי האפליקציה (לדוגמה, ללא הגבלה, שירותי תחזוקה, סליקה, ניהול בסיס נתונים, ושיפור השירותים) או לסייע לנו בניתוח האופן בו נעשה שימוש בשירותי האפליקציה. צדדים שלישיים או סוכנים אלה רשאים להשתמש במידע האישי שלך רק ככל הדרוש לבצע את השירותים שהם מספקים לנו והם נדרשים לנקוט באמצעי הגנה סבירים על מנת להגן ולשמור בסודיות על המידע האישי שלך.'}
                                </Text>

                                <VerticalSpace height={0.04} />
                                <Text style={styles.secondHeaderText}>
                                    {'שמירת המידע שלך'}
                                </Text>
                                <VerticalSpace height={0.04} />
                                <Text style={styles.paragrah}>
                                    {'החברה מאחסנת מידע שנאסף בקשר לשירותי האפליקציה על שרתי ענן חיצוניים, המספקים רמת אבטחת מידע גבוהה למידע שלך. כמו כן, אנו נוקטים בצעדי הגנה על מנת להגן על המידע האישי שלך. על מנת להפחית את הסיכון של גישה או העברה בלתי מאושרת, ולטובת ניהול נתונים באופן מדויק ווידוא שימוש הולם במידע אישי, אנו נוקטים באמצעים פיזיים, אלקטרוניים ומנהליים מתאימים על מנת לשמור ולהגן על המידע אותו אנו מעבדים. במקרה של העברה רשלנית, ננקוט בצעדים סבירים מבחינה מסחרית על מנת להגביל ולתקן את ההעברה. עם זאת, אין אנו יכולים לערוב לכך שצדדים שלישיים בלתי מאושרים לא יצליחו לעולם לעקוף הליכים אלה או לעשות שימוש במידע אישי למטרות בלתי הולמות. זוהי אחריותך להגן על כל הסיסמאות ושמות המשתמש בהם אתה עושה שימוש בגישה לאפליקציה ולהודיע לנו מיד אם אתה יודע או חושד שהסודיות של כל סיסמה ו/או שם משתמש הופרו. אתה האחראי הבלעדי לכל שימוש בלתי מאושר שמתבצע באמצעות הסיסמה ושם המשתמש שלך.'}
                                </Text>

                                <VerticalSpace height={0.04} />
                                <Text style={styles.secondHeaderText}>
                                    {'חומרים של צדדים שלישיים'}
                                </Text>
                                <VerticalSpace height={0.04} />
                                <Text style={styles.paragrah}>
                                    {'אתה עשוי להיות רשאי להיכנס, לבדוק, להציג או להשתמש בשירותים, במשאבים, בתכנים, במידע או בקישורים של צדדים שלישיים, לאתרים או למשאבים אחרים ("חומרי צדדים שלישיים") באמצעות האפליקציה. חומרי הצדדים השלישיים אינם תחת שליטת החברה ואתה מאשר כי הנך נוטל אחריות בלעדית ונוטל את כל הסיכונים הנובעים מכניסה, שימוש או הסתמכות על חומרי צדדים שלישיים כאמור. החברה לא תישא בשום חבות שתיגרם לך כתוצאה מכניסה, שימוש או הסתמכות על חומרי צדדים שלישיים באמצעות האפליקציה. לידיעתך, מדיניות פרטיות זו אינה מכסה את נהלי הפרטיות והגנת המידע המוטמעים על ידי אותם צדדים שלישיים ולכן אנו ממליצים לך לקרוא את מדיניות הפרטיות של הצד השלישי שאליו אתה מקבל גישה, טרם מתן מידע אישי.'}
                                </Text>

                                <VerticalSpace height={0.04} />
                                <Text style={styles.secondHeaderText}>
                                    {'זכות לעיין במידע'}
                                </Text>
                                <VerticalSpace height={0.04} />
                                <Text style={styles.paragrah}>
                                    {'במידה ותרצה לעיין במידע האישי שלך שנמצא ברשותנו וכן לצורך בירור פרטים אחרים הקשורים למידע שלך שנמצא ברשותנו, הנך מוזמן ליצור עמנו קשר בכתובת pic.it.service@gmail.com תיקון המידע שלך אנו נשמור את המידע האישי שלך כל עוד חשבונך פעיל או לפי הצורך על מנת לספק לך את שירותינו, או כנדרש למלא אחר התחייבויותינו החוקיות, לפתור סכסוכים ולאכוף את ההסכמים שלנו. במידה ותרצה שככל הנדרש, נתקן את הרישומים שלך במערכת שלנו, אנא צור עמנו קשר במיילpic.it.service@gmail.com ואנו ננסה למלא את בקשתך.'}
                                </Text>

                                <VerticalSpace height={0.04} />
                                <Text style={styles.secondHeaderText}>
                                    {'פרטיות של קטינים'}
                                </Text>
                                <VerticalSpace height={0.04} />
                                <Text style={styles.paragrah}>
                                    {'החברה מחויבת להגן על צרכי הפרטיות של ילדים ואנו ממליצים להורים ולאפוטרופוסים לקחת תפקיד פעיל בפעילויות ובאינטרסים של ילדיהם באינטרנט. אין אנו אוספים ביודעין מידע אישי מילדים מתחת לגיל 18 והחברה לא מייעדת את השירותים לילדים מתחת לגיל האמור. אם נהיה מודעים לכך שילד מתחת לגיל 18 סיפק לנו מידע אישי, ננקוט בצעדים הדרושים להסיר את המידע האישי כאמור ולסגור את חשבונו של הילד. אם אתה מתחת לגיל 18, אנא אל תמסור לנו כל מידע אישי.'}
                                </Text>

                                <VerticalSpace height={0.04} />
                                <Text style={styles.secondHeaderText}>
                                    {'שינויים במדיניות הפרטיות'}
                                </Text>
                                <VerticalSpace height={0.04} />
                                <Text style={styles.paragrah}>
                                    {'אנו שומרים לעצמנו את הזכות לשנות מדיניות פרטיות זו מעת לעת. הגרסה העדכנית ביותר של המדיניות היא הגרסה הקובעת לעניין השימוש שנעשה במידע האישי ובמידע הלא אישי שלך. במקרה שאנו, לפי שיקול דעתנו הבלעדי, נחליט שעדכונים של מדיניות הפרטיות מהווים שינוי מהותי, אנו נודיע לך על השינויים כאמור בהודעה שתפורסם באמצעות האפליקציה. על אף האמור לעיל, אין אנו מחויבים להודיע למשתמש על שינויים במדיניות זו שאינם מהותיים ולכן על המשתמשים לבקר מעת לעת בעמוד זה על מנת לעיין במדיניות הפרטיות העדכנית שלה הם כפופים.'}
                                </Text>

                                <VerticalSpace height={0.04} />
                                <Text style={styles.secondHeaderText}>
                                    {'יצירת קשר'}
                                </Text>
                                <VerticalSpace height={0.04} />
                                <Text style={styles.paragrah}>
                                    {'אם יש לך שאלות או חששות בנוגע למדיניות פרטיות זו או בנוגע לכל נושא אחר בעניין השירותים, אנא צור עמנו קשר ב:pic.it.service@gmail.com'}
                                </Text>
                                <VerticalSpace height={0.02} />
                                <Text style={styles.paragrah}>
                                    {'עדכון אחרון: יולי, 2021.'}
                                </Text>
                                <VerticalSpace height={0.02} />
                                <Text style={styles.paragrah}>
                                    {'Terms of Use'}
                                </Text>

                                <VerticalSpace height={0.04} />
                                <Text style={styles.secondHeaderText}>
                                    {'Acceptance of Terms'}
                                </Text>
                                <VerticalSpace height={0.04} />
                                <Text style={styles.paragrah}>
                                    {'These Terms of Use (“Terms”) you are reading are a legally binding agreement between Pic.It Simple Ltd. (“Pic.It”, “We” or “Us”) and yourself (“You”). By accessing or using Pic.It’s mobile application (the “Application”) you agree that you have read, understood, accept and agree to be bound by these Terms. If you do not agree to these Terms, do not use the Application. By checking "I agree", you acknowledge that you have read these Terms, understand them, and agree to be bound by them. If you are unwilling to accept all of the Terms, you should not check the "I agree" checkbox and you should not download the Application.'}
                                </Text>
                                <VerticalSpace height={0.04} />
                                <Text style={styles.paragrah}>
                                    {'We may change these terms at any time by sending you an e-mail with details of the change or notifying you of a change when you next start the Application. The new terms may be displayed on-screen and you may be required to read and accept them to continue your use of the Application.'}
                                </Text>
                                <VerticalSpace height={0.04} />
                                <Text style={styles.paragrah}>
                                    {'You are responsible for viewing these Terms periodically. Your continued use of the Application after a change or modification of these Terms has been made will constitute your acceptance of the revised Terms. If you do not agree to the Terms, your only remedy is to discontinue your use of the Application and to cancel any “Account(s)” (as such term is defined below) you have created for use of the Application.'}
                                </Text>
                                <VerticalSpace height={0.04} />
                                <Text style={styles.paragrah}>
                                    {'If you violate the Terms, Pic.It reserves the right to issue you a warning regarding the violation or to immediately terminate or suspend all or part of the Accounts you have created for using the Application. You agree that Pic.It does not need to provide you notice before terminating or suspending your Account(s), but it may provide such notice in its sole discretion.'}
                                </Text>
                                <VerticalSpace height={0.04} />
                                <Text style={styles.paragrah}>
                                    {'You agree that Pic.It may change any part of the Application, including its content, at any time or discontinue the services provided through the Application or any part thereof, for any reason, without notice to you and without liability. You declare that by acceptance of these Terms and/or by using the Application you are at least 18 years of age. You may not use the Application and may not accept these Terms if you are a person barred from receiving the services provided through the Application under the laws of the country in which you are resident or from which you use the Application.'}
                                </Text>

                                <VerticalSpace height={0.04} />
                                <Text style={styles.secondHeaderText}>
                                    {'Description of the Application'}
                                </Text>
                                <VerticalSpace height={0.04} />
                                <Text style={styles.paragrah}>
                                    {'The Application allows you to take photos via the Application’s camera, which enables the organization of photos taken within the Application into automatically generated personal photo albums or photo albums that can be shared with others. Upon reaching a certain quota of photos, required for an album, the Application allows you to order a printed copy of such album, directly through your personal mobile device. Pic.It shall not assume any responsibility to any content which is published, displayed and/or suggested through the Application, its integrity, accuracy and/or reliability. Pic.It cannot guarantee that the Application will always function without disruptions, delay or errors. A number of factors may impact the quality of your communications and use of the Application, and may result in the failure of your communications including, without limitation, your local network, firewall, your internet service provider, the public internet and your power supply. We take no responsibility for any disruption, interruption or delay caused by any failure of or inadequacy in any of these items or any other items over which we have no control.'}
                                </Text>

                                <VerticalSpace height={0.04} />
                                <Text style={styles.secondHeaderText}>
                                    {'Access to the Application'}
                                </Text>
                                <VerticalSpace height={0.04} />
                                <Text style={styles.paragrah}>
                                    {'It is your responsibility to ensure your mobile device meets all the necessary technical specifications to enable you to access and use the Application. Pic.It does not provide you with the equipment to access and/or use our Application. You are responsible for all fees charged by third parties related to your access and use of the Application (e. g., charges by Internet service providers or air time charges).'}
                                </Text>

                                <VerticalSpace height={0.04} />
                                <Text style={styles.secondHeaderText}>
                                    {'Account Information'}
                                </Text>
                                <VerticalSpace height={0.04} />
                                <Text style={styles.paragrah}>
                                    {'During the process of creating an account in order to access the Application (“Account”), you may be required to select a password (the “Login Information”). The following rules govern the security of your Account and Login Information. For the purposes of these Terms, references to Account and Login Information shall include any account and account information, including user names, passwords or security questions, whether or not created for the purpose of using the Application, that are used to access the Application: You shall not share your Account or Login Information, nor let anyone else access your Account or do anything else that might jeopardize the security of your Account;'}
                                </Text>
                                <VerticalSpace height={0.02} />
                                <Text style={styles.paragrah}>
                                    {'In the event you become aware of or reasonably suspect any breach of security, including, without limitation any loss, theft, or unauthorized disclosure of your Login Information or unauthorized access to your Account, you must immediately notify Pic.It and modify your Login Information; You are solely responsible for maintaining the confidentiality of the Login Information, and you will be responsible for all uses of your Login Information, including purchases, whether or not authorized by you; You are responsible for anything that happens through your Account, whether or not such actions were taken by you, including, for the avoidance of doubt, actions taken by third parties. You therefore acknowledge that your Account may be terminated if someone else uses it to engage in any activity that violates these Terms or is otherwise improper or illegal;'}
                                </Text>
                                <VerticalSpace height={0.02} />
                                <Text style={styles.paragrah}>
                                    {'You undertake to monitor your Account and restrict use by any individual barred from accepting these Terms and/or receiving the Application, under the provisions listed herein or any applicable law. You shall accept full responsibility for any unauthorized use of the Application by any of the above mentioned; Pic.It reserves the right to remove or reclaim any usernames at any time and for any reason, including but not limited to claims by a third party that a username violates such third party’s rights.'}
                                </Text>

                                <VerticalSpace height={0.04} />
                                <Text style={styles.secondHeaderText}>
                                    {'Data Protection and privacy'}
                                </Text>
                                <VerticalSpace height={0.04} />
                                <Text style={styles.paragrah}>
                                    {'You hereby acknowledge and agree that upon activation of the Application, Pic.It will receive your location data and will be able to update your location using the Application installed on your mobile phone. Any personal information you provide to us when creating or updating your Account, which may include your name, age, birth date, gender, marital status, address, geographic location, e-mail address, picture, photos taken and any such other information, will be processed in accordance with Pic.It’s Privacy Policy available at (“Privacy Policy”) which constitutes an integral part of these Terms. We will not use the personal information provided by you for any other purpose other than for enabling you to use the Application in accordance with these Terms.'}
                                </Text>
                                <VerticalSpace height={0.02} />
                                <Text style={styles.paragrah}>
                                    {'You agree that you will supply accurate and complete information to us, and that you will update that information promptly after it changes'}
                                </Text>
                                <VerticalSpace height={0.02} />
                                <Text style={styles.paragrah}>
                                    {'You represent and warrant that you have the full right and authority to provide us with such personal information which may include employee information, including, without limitation, obtaining any third party’s consent (to the extent required under any applicable law) and, to the extent required by applicable law, you shall be responsible for ensuring that all necessary privacy notices are provided to employees, whose information is collected for user’s utilization of the Application.'}
                                </Text>

                                <VerticalSpace height={0.04} />
                                <Text style={styles.secondHeaderText}>
                                    {'Right for Non-Commercial Use'}
                                </Text>
                                <VerticalSpace height={0.04} />
                                <Text style={styles.paragrah}>
                                    {'Subject to your agreement and compliance with these Terms, Pic.It grants you a personal, non-exclusive, non-transferable, revocable, limited scope right to use the Application. Use of the Application shall be solely for your own, private, non-commercial purposes and for no other purpose whatsoever. You hereby acknowledge that your right to use the Application is limited by these Terms, and, if you violate or if, at any point, you do not agree to any of these Terms, your right to use the Application shall immediately terminate, and you shall immediately refrain from using the Application. If the Application or any part thereof is determined to be illegal under the laws of the country in which you are situated, you shall not be granted any right to use the Application, and must refrain from using the Application.'}
                                </Text>

                                <VerticalSpace height={0.04} />
                                <Text style={styles.secondHeaderText}>
                                    {'Payment'}
                                </Text>
                                <VerticalSpace height={0.04} />
                                <Text style={styles.paragrah}>
                                    {'Access to the Application is currently free of charge. Pic.It may, at its sole discretion, change this policy and begin charging for access to the Application, and Pic.It may, at its sole discretion, add, remove or change the features and services it offers or the fees (including the amount or the type of fees) Pic.It charges at any time. Pic.It is not responsible for any charges or expenses you incur resulting from being billed by Pic.It in accordance with these Terms (including, inter alia, clearing and other payment Application).'}
                                </Text>

                                <VerticalSpace height={0.04} />
                                <Text style={styles.secondHeaderText}>
                                    {'Account Termination'}
                                </Text>
                                <VerticalSpace height={0.04} />
                                <Text style={styles.paragrah}>
                                    {'Pic.It may refuse access to the Application or may suspend or terminate your Account without notice for any reason, including, but not limited to, a suspected violation of these Terms, illegal or improper use of your Account, or illegal or improper use of the Application, User Content (as defined below), products, or Pic.It’s intellectual property as determined by Pic.It in its sole discretion. You may lose your user name as a result of Account termination or suspension, without responsibility on the part of Pic.It for any damage that may result from the foregoing. If you have more than one Account, Pic.It may terminate all of your Accounts. In addition to the foregoing, Pic.It may selectively remove, revoke or garnishee benefits associated with your Account. If your Account, or a particular subscription for the Application associated with your Account, is terminated, suspended and/or if any benefits are selectively removed, revoked or garnisheed from your Account, no refund will be granted, no benefits will be credited to you or converted to cash or other forms of reimbursement, and you will have no further access to your Account or benefits associated with your Account or the Application.'}
                                </Text>
                                <VerticalSpace height={0.02} />
                                <Text style={styles.paragrah}>
                                    {'You acknowledge that Pic.It is not required to provide you notice before suspending or terminating your Account or selectively removing, revoking or garnisheeing benefits associated with your Account. In the event that Pic.It terminates your Account, you may not participate nor make use of the Application again without Pic.It’s express consent. Pic.It reserves the right to refuse to keep Accounts for, and provide access to the Application or other services to, any individual. You may not allow individuals whose Accounts have been terminated by us to use your Account. If you believe that any action has been taken against your Account in error, please contact us at: pic.it.service@gmail.com. You are solely responsible to preserve the originals of any content you provide and/or upload to the Application. Pic.It does not guarantee that any content will always be available through the Application. Do not rely upon the Application as a storage space for such content.'}
                                </Text>

                                <VerticalSpace height={0.04} />
                                <Text style={styles.secondHeaderText}>
                                    {'User Content'}
                                </Text>
                                <VerticalSpace height={0.04} />
                                <Text style={styles.paragrah}>
                                    {'You agree that any content published by you through the Application is done so through the use of technology and tools provided by Pic.It. You agree that you are publishing such content willingly and you represent that you own such content or have received the necessary authorizations from third parties, that you have all rights to publish said content and that publishing of the content by you complies with all applicable laws. You grant Pic.It the right to act as an agent on your behalf as the Application operator. Pic.It does not claim ownership of any data, text, graphics, photographs, or any other content, and their selection and arrangement, uploaded to the Application by any user (“User Content”). However, by sending and/or creating User Content and/or using the Application you automatically grant Pic.It a non-exclusive, royalty-free, perpetual license of all worldwide rights to use, edit, modify, include, incorporate, adapt, record and reproduce such User Content, including, without limitation, all trademarks associated therewith, in any manner whatsoever, in or out of context, in all languages, in all media now known or hereafter created for the purposes set forth in the Application and these Terms, including for the avoidance of doubt commercial, non-commercial and/or promotional use by Pic.It associating such User Content with your user information, user name and/or profile picture. Pic.It may retain any raw material that you submit, and make internal use of such material including for testing purposes. You may request that Pic.It delete and make no further use of such material by contacting us at: pic.it.service@gmail.com.'}
                                </Text>
                                <VerticalSpace height={0.02} />
                                <Text style={styles.paragrah}>
                                    {'Pic.It may or may not regulate User Content and provides no representations or guarantees regarding the accuracy, quality, or integrity of any User Content posted via the Application. By using the Application you acknowledge and accept that you may be exposed to material you find offensive or objectionable. You agree that Pic.It will not under any circumstances be responsible or liable for any User Content, including, but not limited to, errors in any User Content or any loss or damage incurred by use of the User Content or for any failure to or delay in removing User Content.'}
                                </Text>
                                <VerticalSpace height={0.02} />
                                <Text style={styles.paragrah}>
                                    {'Pic.It reserves the right (but shall at no time be obligated) to, in its sole discretion, remove, block, edit, move, disable or permanently delete User Content from the Application with or without notice for any reason whatsoever. You hereby agree that, to the maximum extent permitted by applicable law, Pic.It shall at no time be responsible or held liable for the removal, modification or blocking of material or User Content that may be considered offensive and shall at no time be obligated to effect such removal other than under applicable law.'}
                                </Text>

                                <VerticalSpace height={0.04} />
                                <Text style={styles.secondHeaderText}>
                                    {'Communication Channels'}
                                </Text>
                                <VerticalSpace height={0.04} />
                                <Text style={styles.paragrah}>
                                    {'The Application may provide communication channels such as forums, communities, or chat areas (“Communication Channels”) designed to enable you to communicate with other users of the Application. Pic.It is under no obligation to monitor these Communication Channels but may do so, and reserves the right to review materials posted to the Communication Channels and to remove any materials, at any time, with or without notice for any reason, at its sole discretion. Pic.It may also terminate or suspend your access to any Communication Channels at any time, without notice, for any reason. You acknowledge that chats, postings, or materials posted by users on the Communication Channels are neither endorsed nor controlled by Pic.It, and these communications should not be considered reviewed or approved by Pic.It. You will be solely responsible for your activities within the Communication Channels and under no circumstances will Pic.It be liable for any activity within the Communication Channels. You agree that all your communications within the Communication Channels are public, and you have no expectation of privacy regarding your use of the Communication Channels. Pic.It is not responsible for information that you choose to share on the Communication Channels, or for the actions of other users.'}
                                </Text>

                                <VerticalSpace height={0.04} />
                                <Text style={styles.secondHeaderText}>
                                    {'Rules of Conduct and Usage'}
                                </Text>
                                <VerticalSpace height={0.04} />
                                <Text style={styles.paragrah}>
                                    {'You represent and warrant that you have full right and authority to use the Application and to be bound by these Terms. You agree that you will comply fully with these Terms and all applicable domestic and international laws, regulations, statutes, ordinances that govern your use of such Application. Without limiting the foregoing and in recognition of the global nature of the Internet, you agree to comply with all local and international rules regarding online conduct. You also agree to comply with all applicable laws affecting the transmission of content or the privacy of persons.'}
                                </Text>
                                <VerticalSpace height={0.02} />
                                <Text style={styles.paragrah}>
                                    {'You undertake that you shall not defraud, or attempt to defraud, Pic.It or other users, and that you shall not act in bad faith in your use of the Application. If Pic.It determines that you have acted in bad faith and/or in violation of these Terms, or if Pic.It determines that your actions fall outside of reasonable community standards, Pic.It may, at its sole discretion, terminate your Account and prohibit you from using the Application. You agree that your use of the Application shall be lawful and that you will comply with the usage rules. In furtherance of the foregoing, and as an example and not as a limitation, you agree that you shall not:'}
                                </Text>
                                <VerticalSpace height={0.02} />
                                <Text style={styles.paragrah}>
                                    {'Create an Account with or access the Application if you are barred from receiving the services provided through the Application under the provisions of these Terms or any applicable law; Upload, post, transmit or otherwise disseminate any material that is vulgar, indecent, obscene, pornographic, sexual or that is, in a reasonable person’s view, otherwise offensive or objectionable; Libel, ridicule, defame, mock, stalk, intimidate, threaten, harass, or abuse anyone, hatefully, racially, ethnically or in any other manner;'}
                                </Text>
                                <VerticalSpace height={0.02} />
                                <Text style={styles.paragrah}>
                                    {'Copy, rent, lease, sell, transfer, assign, sublicense, disassemble, reverse engineer or decompile (except if expressly authorized by Pic.It or by applicable statutory law), modify or alter any part of the Application; Upload or transmit (or attempt to upload or transmit) files that contain viruses, Trojan horses, worms, time bombs, cancelbots, corrupted files or data, or any other similar software or programs that may damage the operation of the Application or the mobile phones of other users of the Application;'}
                                </Text>
                                <VerticalSpace height={0.02} />
                                <Text style={styles.paragrah}>
                                    {'Advertise, solicit or transmit any commercial advertisements, including chain letters, junk e-mail or repetitive messages (spim or spam) to anyone;'}
                                </Text>
                                <VerticalSpace height={0.02} />
                                <Text style={styles.paragrah}>
                                    {'Violate the contractual, personal, intellectual property or other rights of any party including by using, uploading, transmitting, distributing, or otherwise making available any information or material made available through the Application in any manner that infringes any copyright, trademark, patent, trade secret, or other right of any party (including rights of privacy or publicity);'}
                                </Text>
                                <VerticalSpace height={0.02} />
                                <Text style={styles.paragrah}>
                                    {'Create false personas, multiple identities, multiple user Accounts, set up an Account on behalf of someone other than yourself, use bots or other automated software programs to defraud or which otherwise violate these Terms and/or the terms of service of any third-party applications;'}
                                </Text>
                                <VerticalSpace height={0.02} />
                                <Text style={styles.paragrah}>
                                    {'Attempt to obtain passwords or other private information from other members including personally identifiable information (whether in text, image or video form), identification documents, or financial information;'}
                                </Text>
                                <VerticalSpace height={0.02} />
                                <Text style={styles.paragrah}>
                                    {'Upload or transmit (or attempt to upload or to transmit), without Pic.It’s express consent, any material that acts as a passive or active information collection or transmission mechanism, including, without limitation, clear graphics interchange formats (“gifs”), 1x1 pixels, web bugs, cookies or other similar devices (sometimes referred to as “spyware”, “passive collection mechanisms” or “pcms”); Improperly use support channels or complaint buttons to make false reports to Pic.It; Develop and distribute “auto” software programs, “macro” software programs or other “cheat utility” software programs or applications;'}
                                </Text>
                                <VerticalSpace height={0.02} />
                                <Text style={styles.paragrah}>
                                    {'Encourage any third party to: (i) directly or indirectly generate usage, queries, impressions, or clicks through any automated, deceptive, fraudulent or other invalid means; (ii) edit or modify any tag, or remove, obscure or minimize any tag in any way; or (iii) engage in any action or practice that reflects poorly on Pic.It or otherwise disparages or devalues Pic.It’s reputation or goodwill; Make representations with respect to Pic.It not approved in advance and in writing by Pic.It. You shall obtain Pic.It’s prior written approval to the content of any marketing message, and with respect to any use of Pic.It’s trade name and/or trademarks and/or designs in connection with the Application; Rent, lease, sell, trade, gift, bequeath or otherwise transfer your Account to anyone without Pic.It’s prior written consent;'}
                                </Text>
                                <VerticalSpace height={0.02} />
                                <Text style={styles.paragrah}>
                                    {'Access or use an Account which has been rented, leased, sold, traded, gifted, bequeathed, or otherwise transferred from the Account creator without Pic.It’s prior written consent; Engage in any fraudulent activity with respect to payment methods or advertiser tracking mechanisms; Violate any applicable laws or regulations, or encourage or promote any illegal activity including, but not limited to, copyright infringement, trademark infringement, defamation, invasion of privacy, identity theft, hacking, cracking or distribution of counterfeit software, or cheats or hacks for the Application; Attempt to interfere with, hack into or decipher any transmissions to or from the servers for the Application; and/or Interfere with the ability of others to enjoy using the Application, including disruption, overburden or aid the disruption or overburdening of the Application’s servers, or take actions that interfere with or materially increase the cost to provide the Application for the enjoyment of all its users.'}
                                </Text>

                                <VerticalSpace height={0.04} />
                                <Text style={styles.secondHeaderText}>
                                    {'Intellectual Property Ownership'}
                                </Text>
                                <VerticalSpace height={0.04} />
                                <Text style={styles.paragrah}>
                                    {'Pic.It and/or its affiliates retain all rights in the Application’s materials (including, but not limited to, applications, software, designs, graphics, texts, information, pictures, video, sound, music, and other files, and their selection and arrangement) (collectively, “Application’s Materials”). The entire contents of the Application are protected by applicable copyright, trade dress, patent, and trademark laws, international conventions, and other laws protecting intellectual property and related proprietary rights. You shall not, nor shall you cause any other party to modify, decompile, disassemble, reverse engineer, copy, transfer, create derivative works from, rent, sub-license, distribute, reproduce framed, republish, scrape, download, display, transmit, post, lease or sell in any form or by any means, in whole or in part, use for any purpose other than for using the Application pursuant to these Terms or otherwise exploit any of the Application’s Materials without Pic.It’s explicit, prior written consent. The foregoing shall not apply to your own User Content that you post through the Application in accordance with these Terms. All other uses of copyrighted or trade mark material, including any derivative use, require explicit, prior written consent from Pic.It. Any reproduction or redistribution of materials not in accordance with these Terms is explicitly prohibited and may result in the termination of your Account as well as severe civil and criminal penalties. Pic.It and/or its licensors and affiliates own all right, title, and interest, including copyrights and other intellectual property rights, in and to all the Application’s Materials. You hereby acknowledge that you do not acquire any ownership rights by using the Application or by accessing any of the Application’s Materials, or rights to any derivative works thereof.'}
                                </Text>
                                <VerticalSpace height={0.02} />
                                <Text style={styles.paragrah}>
                                    {'You are not required to provide Pic.It with any feedback or suggestions regarding the Application or any of the Application’s Materials. However, should you provide Pic.It with comments or suggestions for the modification, correction, improvement or enhancement of the Application and/or any of the Application’s Materials, then, subject to the terms and conditions of these Terms, you hereby grant Pic.It a non-exclusive, irrevocable, worldwide, royalty-free license, including the right to sublicense, to use and disclose such comments and suggestions in any manner Pic.It chooses and to display, perform, copy, have copied, make, have made, use, sell, offer to sell, and otherwise dispose of Pic.It’s and its sublicensees’ products and content embodying such comments or suggestions in any manner and via any media Pic.It chooses, but without reference to the source of such comments or suggestions.'}
                                </Text>

                                <VerticalSpace height={0.04} />
                                <Text style={styles.secondHeaderText}>
                                    {'Disclaimer of Warranty; Limitation of Liability; Indemnification'}
                                </Text>
                                <VerticalSpace height={0.04} />
                                <Text style={styles.paragrah}>
                                    {'The Application is provided on an “AS IS” and “AS AVAILABLE” basis. You are solely responsible for any and all acts or omissions taken or made in reliance on the Application. You agree that your use of the Application shall be at your sole risk. To the fullest extent permitted by law, Pic.It, its officers, directors, employees, and agents disclaim all warranties, explicit or implied, in connection with the Application and your use thereof including implied warranties of merchantability, title, fitness for a particular purpose or non-infringement, usefulness, authority, accuracy, completeness, and timeliness. Pic.It makes no warranties or representations about the accuracy or completeness of the content of the Application, of the content of any sites linked to the Application, of any “Third Party Materials” (as such term is defined below) and assumes no liability or responsibility for any:'}
                                </Text>
                                <VerticalSpace height={0.02} />
                                <Text style={styles.paragrah}>
                                    {'Errors, mistakes, inaccuracies, non-suitability or non-conformity of any content;'}
                                </Text>
                                <VerticalSpace height={0.02} />
                                <Text style={styles.paragrah}>
                                    {'Direct, indirect, special, incidental, punitive or consequential damages including without derogating personal injury, property damages and/or monetary damages, of any nature whatsoever, arising out of the use of or the inability to use the Application;'}
                                </Text>
                                <VerticalSpace height={0.02} />
                                <Text style={styles.paragrah}>
                                    {'Any unauthorized access to or use of Third Party Materials, secure servers and/or any and all personal information and/or financial information stored therein; Any interruption or cessation of transmission to or from the Application; Any bugs, viruses, Trojan horses, or the like which may be transmitted to or through the Application by any third party; Any results that may be obtained from the use of the Application; The quality of any information, or other material obtained by you through the Application; Any content which is published, displayed and/or suggested through the Application, its integrity, accuracy and/or reliability; or Any errors or omissions in any content or for any loss or damage of any kind incurred as a result of the use of any content posted, e-mailed, transmitted, or otherwise made available via the Application. Without derogating from the abovementioned, in no event will Pic.It, its directors, officers, agents, contractors, partners, consultants and/or employees, be liable to you or any third person for any special, direct, indirect, incidental, special, punitive, or consequential damages whatsoever including any lost profits or lost data arising from your use of the Application or other materials on, accessed through or downloaded from the Application, whether based on warranty, contract, tort, or any other legal theory, and whether or not Pic.It has been advised of the possibility of these damages. The foregoing limitation of liability shall apply to the fullest extent permitted by law in the applicable jurisdiction. You specifically acknowledge that Pic.It shall not be liable for any user submissions and/or defamatory, offensive and/or illegal conduct by any third party, and that the risk of harm or damage from and/or associated with the foregoing rests entirely with you. Without derogating from the aforementioned, in any event Pic.It’s maximum liability in all cases and from all causes of action shall be limited to the sum of US $1. You agree to indemnify and hold Pic.It, and each of its directors, officers, agents, contractors, partners and employees, harmless from and against any loss, liability, claim, demand, damages, costs and expenses, including reasonable attorney’s fees, arising out of or in connection with any of the following: Your use of and access to the Application; Your violation of any term of these Terms; Your violation of any third party right, including without limitation any copyright, property, or privacy right;'}
                                </Text>
                                <VerticalSpace height={0.02} />
                                <Text style={styles.paragrah}>
                                    {'Any claim that any user submission made by you has caused damage to a third party; or Any User Content you post or share on or through the Application.'}
                                </Text>

                                <VerticalSpace height={0.04} />
                                <Text style={styles.secondHeaderText}>
                                    {'Dealings with Other Users'}
                                </Text>
                                <VerticalSpace height={0.04} />
                                <Text style={styles.paragrah}>
                                    {'Your correspondence or business dealings with other users through the Application, including payment and delivery of related goods or services, and any other terms, conditions, warranties or representations associated with such dealings, are solely between you and such other user. You agree that Pic.It will not be responsible or liable for any loss or damage of any sort incurred as the result of any such dealings or as the result of the presence of such other users on the Application.'}
                                </Text>

                                <VerticalSpace height={0.04} />
                                <Text style={styles.secondHeaderText}>
                                    {'Third Party Material'}
                                </Text>
                                <VerticalSpace height={0.04} />
                                <Text style={styles.paragrah}>
                                    {'You may be able to access, review, display or use third party services, resources, content, information or links to other websites or resources (“Third Party Materials”) via the Application. You acknowledge sole responsibility for and assume any and all risks arising from your access to, use of or reliance upon any such Third Party Materials, and Pic.It disclaims any liability that you may incur arising from your access to, use of or reliance upon such Third Party Materials through the Application. You acknowledge and agree that Pic.It: (i) is not responsible for the availability, accuracy, integrity, quality or lawfulness of such Third Party Materials or the products or services on or available from such Third Party Materials; (ii) has no liability to you or any third party for any harm, injuries or losses suffered as a result of your access to or use of such Third Party Materials; and (iii) does not make any promises to remove Third Party Materials from being accessed through the Application. Your ability to access or link to Third Party Materials or third party services does not imply any endorsement by Pic.It of Third Party Materials or any such third party services. These Terms do not authorize you to, and you may not use any Third Party Materials except as expressly permitted by the owners of such Third Party Materials and such owners may have the right to seek damages against you for any unauthorized use of their Third Party Materials.'}
                                </Text>
                                <VerticalSpace height={0.02} />
                                <Text style={styles.paragrah}>
                                    {'Without derogating from any of Pic.It’s rights and remedies under these Terms and/or under law, Pic.It will be entitled, at its sole discretion, to immediately discontinue the Application or any part thereof, including the termination of your Account, in the event of any alleged infringement, misappropriation or violation of any rights of any third parties in connection with the Third Party Materials. You may not use any Third Party Materials for which you have not obtained appropriate approval to use. Pic.It cannot grant permission to use third party content.'}
                                </Text>

                                <VerticalSpace height={0.04} />
                                <Text style={styles.secondHeaderText}>
                                    {'Links, Search Engines'}
                                </Text>
                                <VerticalSpace height={0.04} />
                                <Text style={styles.paragrah}>
                                    {'The Application may contain links to other websites or resources (“Linked Sites”). The Linked Sites are not under the control of Pic.It and Pic.It is not responsible for the contents of any Linked Site, including without limitation any link contained in a Linked Site, or any changes or updates to a Linked Site. Pic.It is not responsible for webcasting or any other form of transmission received from any Linked Site. The inclusion of any link does not imply endorsement by Pic.It of the site or any association with its operators. You acknowledge and agree that Pic.It will not be responsible or liable, directly or indirectly, for any damage or loss caused or alleged to be caused by or in connection with use of or reliance on any such content, goods or services available on or through any such site or resource.'}
                                </Text>

                                <VerticalSpace height={0.04} />
                                <Text style={styles.secondHeaderText}>
                                    {'Notices'}
                                </Text>
                                <VerticalSpace height={0.04} />
                                <Text style={styles.paragrah}>
                                    {'Notices to you may be made via the Application and/or e-mail. Pic.It may also provide notices of changes to these Terms or other matters by displaying notices or links to notices to you generally on the Application. You agree that all agreements, notices, disclosures and any other communications that Pic.It provide as aforementioned satisfy any legal requirement that such communications be in writing. Any and all e-mail notices sent to you will constitute sufficient and effective delivery and notice to you, whether or not you access or review the notice and shall be deemed to have been delivered to you, whether actually received by you or not.'}
                                </Text>

                                <VerticalSpace height={0.04} />
                                <Text style={styles.secondHeaderText}>
                                    {'General'}
                                </Text>
                                <VerticalSpace height={0.04} />
                                <Text style={styles.paragrah}>
                                    {'By using or accessing the Application, you agree that the laws of the State of Israel, without regard to principles of conflict of laws and regardless of your location, will govern these Terms and any dispute of any sort that might arise between you and Pic.It. Any claim or dispute between you and Pic.It that arises in whole or in part from your use of the Application shall be decided exclusively by a court of competent jurisdiction located in Tel-Aviv, Israel, to the exclusion of any other courts, and you hereby consent to, and waive all defenses of lack of personal jurisdiction and forum non-convenient with respect to venue and jurisdiction in the courts of Tel-Aviv, Israel.'}
                                </Text>
                                <VerticalSpace height={0.02} />
                                <Text style={styles.paragrah}>
                                    {'Regardless of any statute or law to the contrary, you agree that any claim or cause of action arising out of or related to the Application must be commenced by you within one (1) year after the cause of action accrues. Otherwise, such cause of action is permanently barred. The failure by Pic.It to enforce any provision of these Terms, will not constitute a waiver of future enforcement of that or any other provision. If, for any reason, a court of competent jurisdiction finds any provision of these Terms invalid or unenforceable, that provision will be enforced to the maximum extent permissible and the other provisions of these Terms will remain in full force and effect. These Terms constitute the complete and exclusive agreement between Pic.It and you regarding its subject matter and supersedes all prior or contemporaneous quotations, agreements, communications or understandings, whether written or oral, relating to its subject matter.'}
                                </Text>
                                <VerticalSpace height={0.02} />
                                <Text style={styles.paragrah}>
                                    {'For any questions about these Terms or any other issue regarding Pic.It or the Application please contact us at: pic.it.service@gmail.com.'}
                                </Text>
                                <VerticalSpace height={0.02} />
                                <Text style={styles.paragrah}>
                                    {'Last update: October 2021'}
                                </Text>
                                <VerticalSpace height={0.02} />
                                <Text style={styles.paragrah}>
                                    {'All rights reserved, Pic.It Simple Ltd.'}
                                </Text>

                            </View>
                        </ScrollView>
                    </View>
                </View>
            </Modal>
        </View>

    );

}

const styles = StyleSheet.create({
    container: {
        elevation: 3,
        borderTopRightRadius: 50,
        borderTopLeftRadius: 50,
        width: width,
        height: '95%',
        backgroundColor: colors.white,
        alignSelf: 'center',
        overflow: 'hidden'
    },
    cardText: {
        textAlign: 'right'
    },
    modal: {
        width: '100%',
        top: 50,
        justifyContent: 'flex-end',
    },
    webView: {
        flex: 1,
        alignSelf: 'center',
        width: '85%'
    },
    wrapper: {
        width: 315,
        alignItems: 'flex-end',
        alignSelf: 'center'
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 50,
        marginLeft: 10,
        marginRight: 10,
    },
    headerText: {
        fontSize: 17,
        color: colors.primary,
        marginLeft: 30,
    },
    secondHeader: {
        alignItems: 'flex-end',
    },
    secondHeaderText: {
        fontSize: 34,
        fontFamily: 'Arimo-Bold',
        color: colors.primary,
        fontWeight: 'bold',
        textAlign: 'right'
    },
    paragrahBlock: {
        marginTop: 18,
    },
    paragrah: {
        textAlign: 'right',
        fontSize: 17,
        fontFamily: 'Arimo-Regular',
        color: 'rgb(64,64,64)',
    },
    underLineParagraph: {
        textAlign: 'right',
        fontSize: 17,
        fontFamily: 'Arimo-Regular',
        color: 'rgb(64,64,64)',
        textDecorationLine: 'underline'
    },
    paragrahHeader: {
        textAlign: 'right',
        fontSize: 25,
        fontFamily: 'Arimo-Bold',
        color: 'rgb(64,64,64)',
    }
});
