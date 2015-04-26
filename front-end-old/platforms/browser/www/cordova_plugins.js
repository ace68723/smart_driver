cordova.define('cordova/plugin_list', function(require, exports, module) {
module.exports = [
    {
        "file": "plugins/org.apache.cordova.splashscreen/www/splashscreen.js",
        "id": "org.apache.cordova.splashscreen.SplashScreen",
        "clobbers": [
            "navigator.splashscreen"
        ]
    },
    {
        "file": "plugins/com.ionic.keyboard/www/keyboard.js",
        "id": "com.ionic.keyboard.keyboard",
        "clobbers": [
            "cordova.plugins.Keyboard"
        ]
    },
    {
        "file": "plugins/org.pbernasconi.progressindicator/www/progressIndicator.js",
        "id": "org.pbernasconi.progressindicator.ProgressIndicator",
        "clobbers": [
            "ProgressIndicator"
        ]
    },
    {
        "file": "plugins/org.apache.cordova.dialogs/www/notification.js",
        "id": "org.apache.cordova.dialogs.notification",
        "merges": [
            "navigator.notification"
        ]
    },
    {
        "file": "plugins/org.apache.cordova.dialogs/www/browser/notification.js",
        "id": "org.apache.cordova.dialogs.notification_browser",
        "merges": [
            "navigator.notification"
        ]
    },
    {
        "file": "plugins/nl.x-services.plugins.actionsheet/www/ActionSheet.js",
        "id": "nl.x-services.plugins.actionsheet.ActionSheet",
        "clobbers": [
            "window.plugins.actionsheet"
        ]
    }
];
module.exports.metadata = 
// TOP OF METADATA
{
    "org.apache.cordova.splashscreen": "0.3.5",
    "com.ionic.keyboard": "1.0.3",
    "org.pbernasconi.progressindicator": "1.1.0",
    "org.apache.cordova.dialogs": "0.3.0",
    "nl.x-services.plugins.actionsheet": "1.1.2"
}
// BOTTOM OF METADATA
});