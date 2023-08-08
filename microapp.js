var USER_NAME = ''
var USER_AVATAR = ''
var Ayoba = getAyoba()

/**
* Determine the mobile operating system and returns the
* proper javascript interface
*/
function getAyoba() {
    var userAgent = navigator.userAgent || navigator.vendor || window.opera;

    // Windows Phone must come first because its UA also contains "Android"
    if (/windows phone/i.test(userAgent)) {
        return null;
    }

    if (/android/i.test(userAgent)) {
        try {
            return Android;
        } catch (error) {
            return null;
        }
    }

    // iOS detection from: http://stackoverflow.com/a/9039885/177710
    if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
        return null; // todo
    }

    return "unknown";
}

if (Ayoba == null || Ayoba == 'unknown') {
    //Browser test Environment
    Ayoba = new AyobaStub();
} else {
    //Ayoba Environment
}

console.log(Ayoba);

// MSISDN
function getMsisdn() {
    let phoneNumber = Ayoba.getMsisdn();
    return phoneNumber
}

function getSelfJid() {
    const selfJid = Ayoba.getSelfJid();
    return selfJid
}

// LOCATION
function getCountry() {
    let countryCode = Ayoba.getCountry();
    return countryCode
}

function closeApp() {
    try {
        Ayoba.finish()
    } catch (err) {
        console.error(err);
    }
}

function onNicknameChanged(nickname) {
    USER_NAME = nickname
}
function onAvatarChanged(avatar) {
    USER_AVATAR = avatar
}