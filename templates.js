// Dynamic Template Management System for WinCC Unified JavaScript
// This system allows you to add, save, and manage your own code templates

class TemplateManager {
    constructor() {
        this.templates = new Map();
        this.categories = new Map();
        this.loadDefaultTemplates();
        this.loadCustomTemplates();
    }

    // Load default Siemens WinCC templates
    loadDefaultTemplates() {
        const defaultTemplates = {
            'tag-read': {
                id: 'tag-read',
                title: 'Read Tag Value',
                category: 'Tag Operations',
                description: 'Safely reads values from WinCC tags with error handling. Use this when you need to get current values from PLC tags, sensors, or internal variables. Includes null checking and diagnostic logging.',
                isCustom: false,
                code: `// Read Tag Value - Siemens WinCC Unified
// Description: Safely reads tag values with error handling and logging
// Use when: Getting current values from PLC tags, sensors, or variables
// Features: Error handling, diagnostic logging, null value protection

function readTagValue(tagName) {
    try {
        var tagValue = Tags(tagName).Read();
        Diagnostics.Trace("Read tag: " + tagName + " = " + tagValue);
        return tagValue;
    } catch (error) {
        Diagnostics.Trace("Error reading tag: " + error.message);
        return null;
    }
}

// Example usage:
var motorSpeed = readTagValue("Motor1_Speed");
var temperature = readTagValue("Tank1_Temperature");

if (motorSpeed !== null) {
    console.log("Motor speed: " + motorSpeed + " RPM");
}`
            },

            'tag-write': {
                id: 'tag-write',
                title: 'Write Tag Value',
                category: 'Tag Operations',
                description: 'Writes values to WinCC tags with validation and error handling. Use this for setting motor speeds, pump controls, recipe values, or any PLC communication. Includes input validation and success confirmation.',
                isCustom: false,
                code: `// Write Tag Value - Siemens WinCC Unified
// Description: Writes values to tags with validation and error handling
// Use when: Setting motor speeds, pump controls, recipe values, PLC communication
// Features: Input validation, error handling, success confirmation, logging

function writeTagValue(tagName, value) {
    try {
        if (tagName === null || tagName === "") {
            throw new Error("Tag name cannot be empty");
        }
        
        Tags(tagName).Write(value);
        Diagnostics.Trace("Wrote tag: " + tagName + " = " + value);
        return true;
    } catch (error) {
        Diagnostics.Trace("Error writing tag: " + error.message);
        return false;
    }
}

// Example usage:
var success = writeTagValue("Motor1_SetPoint", 1500);
writeTagValue("Pump1_Enable", true);
writeTagValue("Recipe_ID", "PROD_001");

if (success) {
    console.log("Tag written successfully");
}`
            },

            'tag-subscribe': {
                id: 'tag-subscribe',
                title: 'Subscribe to Tag Changes',
                category: 'Tag Operations',
                description: 'Subscribe to tag value changes for real-time monitoring. Use this for automatic updates when PLC values change, monitoring critical parameters, or triggering actions based on value changes.',
                isCustom: false,
                code: `// Subscribe to Tag Changes - Siemens WinCC Unified
// Description: Subscribe to tag value changes for real-time monitoring
// Use when: Automatic updates, monitoring critical parameters, triggering actions
// Features: Real-time monitoring, automatic callbacks, error handling

function subscribeToTag(tagName, callback) {
    try {
        if (tagName === null || tagName === "") {
            throw new Error("Tag name cannot be empty");
        }
        
        var subscription = Tags(tagName).Subscribe(function(value, quality, timestamp) {
            try {
                Diagnostics.Trace("Tag changed: " + tagName + " = " + value);
                if (callback && typeof callback === 'function') {
                    callback(value, quality, timestamp);
                }
            } catch (callbackError) {
                Diagnostics.Trace("Callback error: " + callbackError.message);
            }
        });
        
        return subscription;
    } catch (error) {
        Diagnostics.Trace("Error subscribing to tag: " + error.message);
        return null;
    }
}

// Example usage:
var motorSpeedSubscription = subscribeToTag("Motor1_Speed", function(value, quality, timestamp) {
    console.log("Motor speed changed to: " + value + " RPM");
    
    if (value > 1800) {
        console.log("WARNING: Motor speed is high!");
        writeTagValue("Motor1_Alarm", true);
    }
});

// Unsubscribe when done
function unsubscribeFromTag(subscription) {
    try {
        if (subscription) {
            subscription.Unsubscribe();
            Diagnostics.Trace("Successfully unsubscribed");
        }
    } catch (error) {
        Diagnostics.Trace("Error unsubscribing: " + error.message);
    }
}`
            },

            'tag-bulk-operations': {
                id: 'tag-bulk-operations',
                title: 'Bulk Tag Operations',
                category: 'Tag Operations',
                description: 'Perform bulk read/write operations on multiple tags efficiently. Use for batch data collection, mass updates, and synchronized tag operations.',
                isCustom: false,
                code: `// Bulk Tag Operations - Siemens WinCC Unified
// Description: Perform bulk read/write operations on multiple tags efficiently
// Use when: Batch data collection, mass updates, synchronized tag operations
// Features: Bulk read/write, error handling, performance optimization

function readMultipleTags(tagNames) {
    try {
        var results = {};
        var errors = [];
        
        for (var i = 0; i < tagNames.length; i++) {
            var tagName = tagNames[i];
            try {
                results[tagName] = Tags(tagName).Read();
            } catch (tagError) {
                errors.push({ tag: tagName, error: tagError.message });
                results[tagName] = null;
            }
        }
        
        Diagnostics.Trace("Bulk read completed: " + tagNames.length + " tags, " + errors.length + " errors");
        
        return {
            success: true,
            results: results,
            errors: errors,
            count: tagNames.length
        };
    } catch (error) {
        Diagnostics.Trace("Error in bulk read: " + error.message);
        return {
            success: false,
            error: error.message,
            results: {},
            errors: []
        };
    }
}

function writeMultipleTags(tagValuePairs) {
    try {
        var successful = 0;
        var errors = [];
        
        for (var tagName in tagValuePairs) {
            try {
                Tags(tagName).Write(tagValuePairs[tagName]);
                successful++;
            } catch (tagError) {
                errors.push({ tag: tagName, value: tagValuePairs[tagName], error: tagError.message });
            }
        }
        
        var totalTags = Object.keys(tagValuePairs).length;
        Diagnostics.Trace("Bulk write completed: " + successful + "/" + totalTags + " successful");
        
        return {
            success: errors.length === 0,
            successful: successful,
            total: totalTags,
            errors: errors
        };
    } catch (error) {
        Diagnostics.Trace("Error in bulk write: " + error.message);
        return {
            success: false,
            error: error.message,
            successful: 0,
            errors: []
        };
    }
}

function synchronizedTagOperation(readTags, writePairs) {
    try {
        // First read all tags
        var readResults = readMultipleTags(readTags);
        
        // Then write all tags
        var writeResults = writeMultipleTags(writePairs);
        
        Diagnostics.Trace("Synchronized operation completed");
        
        return {
            success: readResults.success && writeResults.success,
            readResults: readResults,
            writeResults: writeResults,
            timestamp: new Date().toISOString()
        };
    } catch (error) {
        Diagnostics.Trace("Error in synchronized operation: " + error.message);
        return {
            success: false,
            error: error.message
        };
    }
}

// Example usage:
var tagsToRead = ["Motor1_Speed", "Motor2_Speed", "Tank1_Level", "Tank2_Level"];
var readResults = readMultipleTags(tagsToRead);

var tagsToWrite = {
    "SetPoint1": 1500,
    "SetPoint2": 1200,
    "Valve1_Position": 75,
    "Valve2_Position": 50
};
var writeResults = writeMultipleTags(tagsToWrite);

var syncResults = synchronizedTagOperation(
    ["Current_Batch", "Process_Status"],
    {"New_Batch": "BATCH_001", "Process_Command": "START"}
);`
            },

            'screen-show': {
                id: 'screen-show',
                title: 'Navigate to Screen',
                category: 'Screen Navigation',
                description: 'Navigate between HMI screens and show popup dialogs. Use this for main navigation, opening detail views, alarm screens, or recipe management screens. Supports both regular navigation and modal popups.',
                isCustom: false,
                code: `// Screen Navigation - Siemens WinCC Unified
// Description: Navigate between HMI screens and show popup dialogs
// Use when: Main navigation, opening detail views, alarm screens, recipe management
// Features: Error handling, popup support, modal dialogs, navigation logging

function navigateToScreen(screenName) {
    try {
        if (screenName === null || screenName === "") {
            throw new Error("Screen name cannot be empty");
        }
        
        Screens(screenName).Show();
        Diagnostics.Trace("Navigated to screen: " + screenName);
        return true;
    } catch (error) {
        Diagnostics.Trace("Error navigating: " + error.message);
        return false;
    }
}

// Show popup dialog
function showPopup(screenName, isModal) {
    try {
        if (isModal) {
            Screens(screenName).ShowModal();
        } else {
            Screens(screenName).ShowPopup();
        }
        return true;
    } catch (error) {
        Diagnostics.Trace("Error showing popup: " + error.message);
        return false;
    }
}

// Example usage:
navigateToScreen("MainOverview");
navigateToScreen("ProcessView");
showPopup("AlarmDetails", true);  // Modal popup
showPopup("QuickSettings", false); // Regular popup`
            },

            'screen-close': {
                id: 'screen-close',
                title: 'Close Screen/Popup',
                category: 'Screen Navigation',
                description: 'Close current screen or popup windows. Use this for returning to previous screens, closing dialog boxes, or managing screen navigation flow.',
                isCustom: false,
                code: `// Close Screen/Popup - Siemens WinCC Unified
// Description: Close current screen or popup windows
// Use when: Returning to previous screens, closing dialogs, managing navigation
// Features: Safe closing, error handling, navigation logging

function closeCurrentScreen() {
    try {
        Screens.Close();
        Diagnostics.Trace("Screen closed successfully");
        return true;
    } catch (error) {
        Diagnostics.Trace("Error closing screen: " + error.message);
        return false;
    }
}

function closePopup(popupName) {
    try {
        if (popupName) {
            Screens(popupName).Close();
            Diagnostics.Trace("Popup closed: " + popupName);
        } else {
            Screens.ClosePopup();
            Diagnostics.Trace("Current popup closed");
        }
        return true;
    } catch (error) {
        Diagnostics.Trace("Error closing popup: " + error.message);
        return false;
    }
}

// Example usage:
closeCurrentScreen();
closePopup("AlarmDetails");
closePopup(); // Close current popup`
            },

            'alarm-ack': {
                id: 'alarm-ack',
                title: 'Acknowledge Alarms',
                category: 'Alarm Management',
                description: 'Acknowledge individual alarms or all active alarms at once. Use this for alarm management, operator acknowledgment, and alarm system integration. Includes bulk operations and active alarm querying.',
                isCustom: false,
                code: `// Acknowledge Alarms - Siemens WinCC Unified
// Description: Acknowledge individual alarms or all active alarms
// Use when: Alarm management, operator acknowledgment, alarm system integration
// Features: Individual and bulk acknowledgment, active alarm querying, error handling

function acknowledgeAlarm(alarmId) {
    try {
        if (alarmId === null || alarmId === undefined) {
            throw new Error("Alarm ID cannot be null");
        }
        
        Alarms(alarmId).Acknowledge();
        Diagnostics.Trace("Alarm acknowledged: " + alarmId);
        return true;
    } catch (error) {
        Diagnostics.Trace("Error acknowledging alarm: " + error.message);
        return false;
    }
}

function acknowledgeAllAlarms() {
    try {
        var activeAlarms = Alarms.GetActive();
        var acknowledgedCount = 0;
        
        for (var i = 0; i < activeAlarms.length; i++) {
            if (acknowledgeAlarm(activeAlarms[i].Id)) {
                acknowledgedCount++;
            }
        }
        
        Diagnostics.Trace("Acknowledged " + acknowledgedCount + " alarms");
        return acknowledgedCount;
    } catch (error) {
        Diagnostics.Trace("Error acknowledging all alarms: " + error.message);
        return 0;
    }
}

// Get active alarms
function getActiveAlarms() {
    try {
        var activeAlarms = Alarms.GetActive();
        console.log("Active alarms: " + activeAlarms.length);
        return activeAlarms;
    } catch (error) {
        Diagnostics.Trace("Error getting alarms: " + error.message);
        return [];
    }
}

// Example usage:
acknowledgeAlarm("ALARM_001");
var totalAcked = acknowledgeAllAlarms();
var alarms = getActiveAlarms();`
            },

            'alarm-filter': {
                id: 'alarm-filter',
                title: 'Filter Alarms',
                category: 'Alarm Management',
                description: 'Filter and query alarms by various criteria like priority, category, or time range. Use this for alarm analysis, reporting, and custom alarm displays.',
                isCustom: false,
                code: `// Filter Alarms - Siemens WinCC Unified
// Description: Filter and query alarms by various criteria
// Use when: Alarm analysis, reporting, custom alarm displays
// Features: Multiple filter criteria, priority filtering, time-based queries

function getAlarmsByPriority(minPriority, maxPriority) {
    try {
        var allAlarms = Alarms.GetActive();
        var filteredAlarms = [];
        
        for (var i = 0; i < allAlarms.length; i++) {
            var alarm = allAlarms[i];
            if (alarm.Priority >= minPriority && alarm.Priority <= maxPriority) {
                filteredAlarms.push(alarm);
            }
        }
        
        Diagnostics.Trace("Found " + filteredAlarms.length + " alarms with priority " + minPriority + "-" + maxPriority);
        return filteredAlarms;
    } catch (error) {
        Diagnostics.Trace("Error filtering alarms: " + error.message);
        return [];
    }
}

function getAlarmsByCategory(category) {
    try {
        var allAlarms = Alarms.GetActive();
        var filteredAlarms = [];
        
        for (var i = 0; i < allAlarms.length; i++) {
            var alarm = allAlarms[i];
            if (alarm.Category === category) {
                filteredAlarms.push(alarm);
            }
        }
        
        Diagnostics.Trace("Found " + filteredAlarms.length + " alarms in category: " + category);
        return filteredAlarms;
    } catch (error) {
        Diagnostics.Trace("Error filtering alarms by category: " + error.message);
        return [];
    }
}

// Example usage:
var highPriorityAlarms = getAlarmsByPriority(8, 10);
var motorAlarms = getAlarmsByCategory("Motor");
var criticalAlarms = getAlarmsByPriority(9, 10);`
            },

            'recipe-load': {
                id: 'recipe-load',
                title: 'Load Recipe',
                category: 'Recipe Management',
                description: 'Load and save recipe data for production processes. Use this for batch production, product changeovers, parameter management, and production setup. Includes recipe validation and bulk tag operations.',
                isCustom: false,
                code: `// Load Recipe - Siemens WinCC Unified
// Description: Load and save recipe data for production processes
// Use when: Batch production, product changeovers, parameter management, production setup
// Features: Recipe validation, bulk tag operations, success reporting, error handling

function loadRecipe(recipeName) {
    try {
        if (recipeName === null || recipeName === "") {
            throw new Error("Recipe name cannot be empty");
        }
        
        if (!Recipes.Exists(recipeName)) {
            throw new Error("Recipe does not exist: " + recipeName);
        }
        
        var result = Recipes(recipeName).Load();
        
        if (result.Success) {
            Diagnostics.Trace("Recipe loaded: " + recipeName);
            return {
                success: true,
                message: "Recipe loaded successfully",
                valuesLoaded: result.ValuesLoaded
            };
        } else {
            throw new Error(result.ErrorMessage);
        }
    } catch (error) {
        Diagnostics.Trace("Error loading recipe: " + error.message);
        return {
            success: false,
            message: error.message,
            valuesLoaded: 0
        };
    }
}

function saveRecipe(recipeName, tagList) {
    try {
        var recipeData = [];
        
        for (var i = 0; i < tagList.length; i++) {
            var tagName = tagList[i];
            try {
                var value = Tags(tagName).Read();
                recipeData.push({ tagName: tagName, value: value });
            } catch (tagError) {
                Diagnostics.Trace("Could not read tag: " + tagName);
            }
        }
        
        var result = Recipes(recipeName).Save(recipeData);
        
        if (result.Success) {
            Diagnostics.Trace("Recipe saved: " + recipeName);
            return { success: true, valuesSaved: recipeData.length };
        } else {
            throw new Error(result.ErrorMessage);
        }
    } catch (error) {
        Diagnostics.Trace("Error saving recipe: " + error.message);
        return { success: false, message: error.message };
    }
}

// Example usage:
var result = loadRecipe("Production_Recipe_001");
if (result.success) {
    console.log("Loaded " + result.valuesLoaded + " values");
}

var tagsToSave = ["Motor1_Speed", "Pump1_Pressure"];
var saveResult = saveRecipe("Current_Settings", tagsToSave);`
            },

            'timer-functions': {
                id: 'timer-functions',
                title: 'Timer Functions',
                category: 'Utilities',
                description: 'Create timers for delayed actions, periodic tasks, and time-based automation. Use this for scheduled operations, delays, timeouts, and recurring processes.',
                isCustom: false,
                code: `// Timer Functions - Siemens WinCC Unified
// Description: Create timers for delayed actions and periodic tasks
// Use when: Scheduled operations, delays, timeouts, recurring processes
// Features: One-time and recurring timers, error handling, timer management

function createTimer(intervalMs, callback, isRecurring) {
    try {
        if (typeof callback !== 'function') {
            throw new Error("Callback must be a function");
        }
        
        var timerId;
        
        if (isRecurring) {
            timerId = setInterval(function() {
                try {
                    callback();
                } catch (callbackError) {
                    Diagnostics.Trace("Timer callback error: " + callbackError.message);
                }
            }, intervalMs);
        } else {
            timerId = setTimeout(function() {
                try {
                    callback();
                } catch (callbackError) {
                    Diagnostics.Trace("Timer callback error: " + callbackError.message);
                }
            }, intervalMs);
        }
        
        Diagnostics.Trace("Timer created: " + timerId + " (" + intervalMs + "ms)");
        return timerId;
    } catch (error) {
        Diagnostics.Trace("Error creating timer: " + error.message);
        return null;
    }
}

function stopTimer(timerId, isRecurring) {
    try {
        if (timerId) {
            if (isRecurring) {
                clearInterval(timerId);
            } else {
                clearTimeout(timerId);
            }
            Diagnostics.Trace("Timer stopped: " + timerId);
            return true;
        }
        return false;
    } catch (error) {
        Diagnostics.Trace("Error stopping timer: " + error.message);
        return false;
    }
}

// Example usage:
// One-time delay
var delayTimer = createTimer(5000, function() {
    console.log("5 seconds have passed!");
    writeTagValue("DelayComplete", true);
}, false);

// Recurring timer
var monitorTimer = createTimer(1000, function() {
    var temp = readTagValue("Temperature");
    if (temp > 80) {
        console.log("Temperature warning: " + temp);
    }
}, true);

// Stop timers when needed
stopTimer(delayTimer, false);
stopTimer(monitorTimer, true);`
            },

            'data-logging': {
                id: 'data-logging',
                title: 'Data Logging',
                category: 'Utilities',
                description: 'Log data to files, databases, or diagnostic traces. Use this for production data recording, troubleshooting, audit trails, and performance monitoring.',
                isCustom: false,
                code: `// Data Logging - Siemens WinCC Unified
// Description: Log data to files, databases, or diagnostic traces
// Use when: Production data recording, troubleshooting, audit trails, monitoring
// Features: Multiple log levels, structured logging, error handling

function logData(level, message, data) {
    try {
        var timestamp = new Date().toISOString();
        var logEntry = timestamp + " [" + level + "] " + message;
        
        if (data !== undefined && data !== null) {
            logEntry += " | Data: " + JSON.stringify(data);
        }
        
        // Log to WinCC diagnostics
        Diagnostics.Trace(logEntry);
        
        // You can also log to custom files or databases here
        // Example: writeToLogFile(logEntry);
        
        return true;
    } catch (error) {
        Diagnostics.Trace("Logging error: " + error.message);
        return false;
    }
}

function logInfo(message, data) {
    return logData("INFO", message, data);
}

function logWarning(message, data) {
    return logData("WARNING", message, data);
}

function logError(message, data) {
    return logData("ERROR", message, data);
}

function logProduction(batchId, operation, values) {
    try {
        var productionData = {
            batchId: batchId,
            operation: operation,
            timestamp: new Date().toISOString(),
            values: values
        };
        
        logInfo("Production data", productionData);
        
        // Additional production-specific logging
        Diagnostics.Trace("PRODUCTION: Batch " + batchId + " - " + operation);
        
        return true;
    } catch (error) {
        logError("Production logging failed", { batchId: batchId, error: error.message });
        return false;
    }
}

// Example usage:
logInfo("System started", { version: "1.0", user: "Operator1" });
logWarning("High temperature detected", { temp: 85, limit: 80 });
logError("Motor communication failed", { motor: "Motor1", error: "Timeout" });

logProduction("BATCH_001", "Mixing", {
    motor1Speed: 1500,
    temperature: 75,
    pressure: 2.5
});`
            },

            'user-management': {
                id: 'user-management',
                title: 'User Management',
                category: 'Security',
                description: 'Handle user login, logout, and role management. Use this for authentication, authorization, and user session management in WinCC Unified applications.',
                isCustom: false,
                code: `// User Management - Siemens WinCC Unified
// Description: Handle user login, logout, and role management
// Use when: Authentication, authorization, user session management
// Features: Login/logout, role checking, user info retrieval

function loginUser(username, password) {
    try {
        var result = Users.Login(username, password);
        
        if (result.Success) {
            Diagnostics.Trace("User logged in: " + username);
            return {
                success: true,
                user: result.User,
                roles: result.Roles
            };
        } else {
            Diagnostics.Trace("Login failed for user: " + username);
            return {
                success: false,
                error: result.ErrorMessage
            };
        }
    } catch (error) {
        Diagnostics.Trace("Login error: " + error.message);
        return {
            success: false,
            error: error.message
        };
    }
}

function logoutUser() {
    try {
        Users.Logout();
        Diagnostics.Trace("User logged out");
        return true;
    } catch (error) {
        Diagnostics.Trace("Logout error: " + error.message);
        return false;
    }
}

function getCurrentUser() {
    try {
        var currentUser = Users.GetCurrent();
        return {
            username: currentUser.Name,
            roles: currentUser.Roles,
            isLoggedIn: currentUser.IsLoggedIn
        };
    } catch (error) {
        Diagnostics.Trace("Error getting current user: " + error.message);
        return null;
    }
}

function hasRole(roleName) {
    try {
        return Users.HasRole(roleName);
    } catch (error) {
        Diagnostics.Trace("Error checking role: " + error.message);
        return false;
    }
}

// Example usage:
var loginResult = loginUser("operator1", "password123");
if (loginResult.success) {
    console.log("Welcome " + loginResult.user.Name);
}

var currentUser = getCurrentUser();
if (currentUser && hasRole("Administrator")) {
    console.log("User has admin privileges");
}

logoutUser();`
            },

            'trend-archive': {
                id: 'trend-archive',
                title: 'Trend & Archive Data',
                category: 'Data Management',
                description: 'Access historical trend data and archive values. Use this for data analysis, reporting, historical trending, and process optimization.',
                isCustom: false,
                code: `// Trend & Archive Data - Siemens WinCC Unified
// Description: Access historical trend data and archive values
// Use when: Data analysis, reporting, historical trending, process optimization
// Features: Historical data retrieval, time range queries, data export

function getTrendData(tagName, startTime, endTime) {
    try {
        var trendData = Archive.GetValues(tagName, startTime, endTime);
        
        Diagnostics.Trace("Retrieved " + trendData.length + " trend values for " + tagName);
        
        return {
            success: true,
            data: trendData,
            count: trendData.length
        };
    } catch (error) {
        Diagnostics.Trace("Error getting trend data: " + error.message);
        return {
            success: false,
            error: error.message,
            data: []
        };
    }
}

function getLastNValues(tagName, count) {
    try {
        var values = Archive.GetLastValues(tagName, count);
        
        Diagnostics.Trace("Retrieved last " + count + " values for " + tagName);
        
        return {
            success: true,
            data: values,
            count: values.length
        };
    } catch (error) {
        Diagnostics.Trace("Error getting last values: " + error.message);
        return {
            success: false,
            error: error.message,
            data: []
        };
    }
}

function exportTrendData(tagName, startTime, endTime, format) {
    try {
        var data = getTrendData(tagName, startTime, endTime);
        
        if (!data.success) {
            return data;
        }
        
        var exportResult = Archive.Export(data.data, format || "CSV");
        
        if (exportResult.Success) {
            Diagnostics.Trace("Trend data exported successfully");
            return {
                success: true,
                filePath: exportResult.FilePath,
                recordCount: data.count
            };
        } else {
            throw new Error(exportResult.ErrorMessage);
        }
    } catch (error) {
        Diagnostics.Trace("Error exporting trend data: " + error.message);
        return {
            success: false,
            error: error.message
        };
    }
}

// Example usage:
var yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);
var now = new Date();

var trendData = getTrendData("Temperature_Tank1", yesterday, now);
if (trendData.success) {
    console.log("Retrieved " + trendData.count + " data points");
}

var lastValues = getLastNValues("Pressure_Line1", 100);
var exportResult = exportTrendData("Motor1_Speed", yesterday, now, "CSV");`
            },

            'communication': {
                id: 'communication',
                title: 'Communication & OPC',
                category: 'Communication',
                description: 'Handle OPC UA communication, database connections, and external system integration. Use for data exchange with PLCs, SCADA systems, and databases.',
                isCustom: false,
                code: `// Communication & OPC - Siemens WinCC Unified
// Description: Handle OPC UA communication and external system integration
// Use when: Data exchange with PLCs, SCADA systems, databases
// Features: OPC connections, database queries, external communication

function connectToOPCServer(serverUrl, username, password) {
    try {
        var connection = OPC.Connect(serverUrl, {
            username: username,
            password: password,
            timeout: 5000
        });
        
        if (connection.IsConnected) {
            Diagnostics.Trace("Connected to OPC server: " + serverUrl);
            return {
                success: true,
                connection: connection
            };
        } else {
            throw new Error("Failed to connect to OPC server");
        }
    } catch (error) {
        Diagnostics.Trace("OPC connection error: " + error.message);
        return {
            success: false,
            error: error.message
        };
    }
}

function readOPCValue(connection, nodeId) {
    try {
        var value = connection.ReadValue(nodeId);
        
        Diagnostics.Trace("Read OPC value: " + nodeId + " = " + value);
        
        return {
            success: true,
            value: value.Value,
            quality: value.Quality,
            timestamp: value.Timestamp
        };
    } catch (error) {
        Diagnostics.Trace("Error reading OPC value: " + error.message);
        return {
            success: false,
            error: error.message
        };
    }
}

function writeOPCValue(connection, nodeId, value) {
    try {
        var result = connection.WriteValue(nodeId, value);
        
        if (result.Success) {
            Diagnostics.Trace("Wrote OPC value: " + nodeId + " = " + value);
            return { success: true };
        } else {
            throw new Error(result.ErrorMessage);
        }
    } catch (error) {
        Diagnostics.Trace("Error writing OPC value: " + error.message);
        return {
            success: false,
            error: error.message
        };
    }
}

function executeDatabaseQuery(connectionString, query) {
    try {
        var connection = Database.Connect(connectionString);
        var result = connection.ExecuteQuery(query);
        
        Diagnostics.Trace("Database query executed: " + result.RowCount + " rows");
        
        return {
            success: true,
            data: result.Data,
            rowCount: result.RowCount
        };
    } catch (error) {
        Diagnostics.Trace("Database query error: " + error.message);
        return {
            success: false,
            error: error.message
        };
    }
}

// Example usage:
var opcConnection = connectToOPCServer("opc.tcp://192.168.1.100:4840", "user", "pass");
if (opcConnection.success) {
    var value = readOPCValue(opcConnection.connection, "ns=2;i=1001");
    writeOPCValue(opcConnection.connection, "ns=2;i=1002", 150);
}

var dbResult = executeDatabaseQuery("Server=localhost;Database=Production;", 
    "SELECT * FROM BatchData WHERE Date > GETDATE()-1");`
            },

            'event-handling': {
                id: 'event-handling',
                title: 'Event Handling',
                category: 'Events',
                description: 'Handle button clicks, value changes, and system events. Use for interactive HMI elements, automated responses, and event-driven programming.',
                isCustom: false,
                code: `// Event Handling - Siemens WinCC Unified
// Description: Handle button clicks, value changes, and system events
// Use when: Interactive HMI elements, automated responses, event-driven programming
// Features: Button events, value change events, system events, custom events

function onButtonClick(buttonName, action) {
    try {
        Diagnostics.Trace("Button clicked: " + buttonName);
        
        if (typeof action === 'function') {
            action();
        }
        
        // Common button actions
        switch (buttonName) {
            case "StartProcess":
                writeTagValue("Process_Start", true);
                break;
            case "StopProcess":
                writeTagValue("Process_Stop", true);
                break;
            case "EmergencyStop":
                writeTagValue("Emergency_Stop", true);
                navigateToScreen("EmergencyScreen");
                break;
            default:
                Diagnostics.Trace("Unknown button: " + buttonName);
        }
        
        return true;
    } catch (error) {
        Diagnostics.Trace("Button click error: " + error.message);
        return false;
    }
}

function onValueChanged(tagName, newValue, oldValue) {
    try {
        Diagnostics.Trace("Value changed: " + tagName + " from " + oldValue + " to " + newValue);
        
        // Handle specific value changes
        if (tagName === "Temperature" && newValue > 80) {
            writeTagValue("Temperature_Alarm", true);
            showPopup("TemperatureWarning", true);
        }
        
        if (tagName === "Motor_Status" && newValue === "Fault") {
            writeTagValue("Motor_Alarm", true);
            logError("Motor fault detected", { motor: tagName, status: newValue });
        }
        
        return true;
    } catch (error) {
        Diagnostics.Trace("Value change handler error: " + error.message);
        return false;
    }
}

function onSystemEvent(eventType, eventData) {
    try {
        Diagnostics.Trace("System event: " + eventType);
        
        switch (eventType) {
            case "UserLogin":
                logInfo("User logged in", { user: eventData.username });
                break;
            case "UserLogout":
                logInfo("User logged out", { user: eventData.username });
                break;
            case "AlarmOccurred":
                handleAlarmEvent(eventData);
                break;
            case "RecipeLoaded":
                logInfo("Recipe loaded", { recipe: eventData.recipeName });
                break;
            default:
                Diagnostics.Trace("Unhandled system event: " + eventType);
        }
        
        return true;
    } catch (error) {
        Diagnostics.Trace("System event handler error: " + error.message);
        return false;
    }
}

function handleAlarmEvent(alarmData) {
    try {
        var priority = alarmData.Priority;
        
        if (priority >= 8) {
            // High priority alarm
            showPopup("HighPriorityAlarm", true);
            writeTagValue("Alarm_Horn", true);
        }
        
        logWarning("Alarm occurred", alarmData);
        return true;
    } catch (error) {
        Diagnostics.Trace("Alarm event handler error: " + error.message);
        return false;
    }
}

// Example usage:
// Button click handlers
onButtonClick("StartProcess", function() {
    console.log("Starting production process");
});

// Value change monitoring
onValueChanged("Tank_Level", 85, 70);
onValueChanged("Motor_Speed", 1500, 1200);

// System event handling
onSystemEvent("UserLogin", { username: "operator1" });
onSystemEvent("AlarmOccurred", { id: "ALM001", priority: 9, message: "High temperature" });`
            },

            'graphics-animation': {
                id: 'graphics-animation',
                title: 'Graphics & Animation',
                category: 'Graphics',
                description: 'Control graphics, animations, and visual elements. Use for dynamic displays, status indicators, progress bars, and interactive graphics.',
                isCustom: false,
                code: `// Graphics & Animation - Siemens WinCC Unified
// Description: Control graphics, animations, and visual elements
// Use when: Dynamic displays, status indicators, progress bars, interactive graphics
// Features: Color changes, animations, visibility control, dynamic graphics

function setElementColor(elementName, color) {
    try {
        var element = HMI.GetElement(elementName);
        if (element) {
            element.BackgroundColor = color;
            Diagnostics.Trace("Element color changed: " + elementName + " to " + color);
            return true;
        } else {
            throw new Error("Element not found: " + elementName);
        }
    } catch (error) {
        Diagnostics.Trace("Error setting element color: " + error.message);
        return false;
    }
}

function setElementVisibility(elementName, visible) {
    try {
        var element = HMI.GetElement(elementName);
        if (element) {
            element.Visible = visible;
            Diagnostics.Trace("Element visibility changed: " + elementName + " = " + visible);
            return true;
        } else {
            throw new Error("Element not found: " + elementName);
        }
    } catch (error) {
        Diagnostics.Trace("Error setting element visibility: " + error.message);
        return false;
    }
}

function animateElement(elementName, property, startValue, endValue, duration) {
    try {
        var element = HMI.GetElement(elementName);
        if (!element) {
            throw new Error("Element not found: " + elementName);
        }
        
        var steps = 20;
        var stepValue = (endValue - startValue) / steps;
        var stepDuration = duration / steps;
        var currentStep = 0;
        
        var animationTimer = setInterval(function() {
            try {
                currentStep++;
                var currentValue = startValue + (stepValue * currentStep);
                
                element[property] = currentValue;
                
                if (currentStep >= steps) {
                    clearInterval(animationTimer);
                    element[property] = endValue;
                    Diagnostics.Trace("Animation completed: " + elementName);
                }
            } catch (animError) {
                clearInterval(animationTimer);
                Diagnostics.Trace("Animation error: " + animError.message);
            }
        }, stepDuration);
        
        return true;
    } catch (error) {
        Diagnostics.Trace("Error starting animation: " + error.message);
        return false;
    }
}

function updateProgressBar(progressBarName, percentage) {
    try {
        var progressBar = HMI.GetElement(progressBarName);
        if (progressBar) {
            progressBar.Value = Math.max(0, Math.min(100, percentage));
            
            // Change color based on percentage
            if (percentage < 30) {
                progressBar.ForegroundColor = "Red";
            } else if (percentage < 70) {
                progressBar.ForegroundColor = "Yellow";
            } else {
                progressBar.ForegroundColor = "Green";
            }
            
            Diagnostics.Trace("Progress bar updated: " + progressBarName + " = " + percentage + "%");
            return true;
        } else {
            throw new Error("Progress bar not found: " + progressBarName);
        }
    } catch (error) {
        Diagnostics.Trace("Error updating progress bar: " + error.message);
        return false;
    }
}

function blinkElement(elementName, interval, duration) {
    try {
        var element = HMI.GetElement(elementName);
        if (!element) {
            throw new Error("Element not found: " + elementName);
        }
        
        var originalVisibility = element.Visible;
        var blinkCount = 0;
        var maxBlinks = Math.floor(duration / interval);
        
        var blinkTimer = setInterval(function() {
            try {
                element.Visible = !element.Visible;
                blinkCount++;
                
                if (blinkCount >= maxBlinks) {
                    clearInterval(blinkTimer);
                    element.Visible = originalVisibility;
                    Diagnostics.Trace("Blinking completed: " + elementName);
                }
            } catch (blinkError) {
                clearInterval(blinkTimer);
                Diagnostics.Trace("Blink error: " + blinkError.message);
            }
        }, interval);
        
        return true;
    } catch (error) {
        Diagnostics.Trace("Error starting blink: " + error.message);
        return false;
    }
}

// Example usage:
setElementColor("MotorStatus", "Green");
setElementVisibility("AlarmPanel", true);
animateElement("TankLevel", "Height", 0, 100, 2000);
updateProgressBar("ProcessProgress", 75);
blinkElement("AlarmLight", 500, 5000);`
            },

            'reports-printing': {
                id: 'reports-printing',
                title: 'Reports & Printing',
                category: 'Reports',
                description: 'Generate reports and handle printing functions. Use for production reports, alarm logs, batch reports, and document generation.',
                isCustom: false,
                code: `// Reports & Printing - Siemens WinCC Unified
// Description: Generate reports and handle printing functions
// Use when: Production reports, alarm logs, batch reports, document generation
// Features: Report generation, printing, PDF export, data formatting

function generateProductionReport(startDate, endDate) {
    try {
        var reportData = {
            title: "Production Report",
            period: startDate + " to " + endDate,
            generatedBy: getCurrentUser().username,
            generatedAt: new Date().toISOString(),
            data: []
        };
        
        // Collect production data
        var productionTags = ["Production_Count", "Quality_Rate", "Downtime_Minutes"];
        
        for (var i = 0; i < productionTags.length; i++) {
            var tagName = productionTags[i];
            var trendData = getTrendData(tagName, new Date(startDate), new Date(endDate));
            
            if (trendData.success) {
                reportData.data.push({
                    parameter: tagName,
                    values: trendData.data,
                    average: calculateAverage(trendData.data),
                    min: Math.min.apply(Math, trendData.data.map(v => v.Value)),
                    max: Math.max.apply(Math, trendData.data.map(v => v.Value))
                });
            }
        }
        
        Diagnostics.Trace("Production report generated with " + reportData.data.length + " parameters");
        
        return {
            success: true,
            report: reportData
        };
    } catch (error) {
        Diagnostics.Trace("Error generating production report: " + error.message);
        return {
            success: false,
            error: error.message
        };
    }
}

function printReport(reportData, printerName) {
    try {
        var printJob = Reports.CreatePrintJob(printerName || "Default");
        
        printJob.AddHeader(reportData.title);
        printJob.AddLine("Generated: " + reportData.generatedAt);
        printJob.AddLine("Period: " + reportData.period);
        printJob.AddLine("Generated by: " + reportData.generatedBy);
        printJob.AddSeparator();
        
        for (var i = 0; i < reportData.data.length; i++) {
            var item = reportData.data[i];
            printJob.AddSection(item.parameter);
            printJob.AddLine("Average: " + item.average.toFixed(2));
            printJob.AddLine("Min: " + item.min.toFixed(2));
            printJob.AddLine("Max: " + item.max.toFixed(2));
            printJob.AddSeparator();
        }
        
        var result = printJob.Print();
        
        if (result.Success) {
            Diagnostics.Trace("Report printed successfully");
            return { success: true, jobId: result.JobId };
        } else {
            throw new Error(result.ErrorMessage);
        }
    } catch (error) {
        Diagnostics.Trace("Error printing report: " + error.message);
        return {
            success: false,
            error: error.message
        };
    }
}

function exportReportToPDF(reportData, filePath) {
    try {
        var pdfExporter = Reports.CreatePDFExporter();
        
        pdfExporter.SetTitle(reportData.title);
        pdfExporter.SetAuthor(reportData.generatedBy);
        pdfExporter.SetSubject("Production Report");
        
        var result = pdfExporter.Export(reportData, filePath);
        
        if (result.Success) {
            Diagnostics.Trace("Report exported to PDF: " + filePath);
            return { success: true, filePath: filePath };
        } else {
            throw new Error(result.ErrorMessage);
        }
    } catch (error) {
        Diagnostics.Trace("Error exporting to PDF: " + error.message);
        return {
            success: false,
            error: error.message
        };
    }
}

function calculateAverage(dataArray) {
    if (dataArray.length === 0) return 0;
    
    var sum = dataArray.reduce(function(total, item) {
        return total + (item.Value || item);
    }, 0);
    
    return sum / dataArray.length;
}

// Example usage:
var yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0];
var today = new Date().toISOString().split('T')[0];

var report = generateProductionReport(yesterday, today);
if (report.success) {
    printReport(report.report, "ProductionPrinter");
    exportReportToPDF(report.report, "C:\\Reports\\Production_" + today + ".pdf");
}`
            },

            'system-functions': {
                id: 'system-functions',
                title: 'System Functions',
                category: 'System',
                description: 'Access system information, runtime data, and performance metrics. Use for system monitoring, diagnostics, and maintenance functions.',
                isCustom: false,
                code: `// System Functions - Siemens WinCC Unified
// Description: Access system information, runtime data, and performance metrics
// Use when: System monitoring, diagnostics, maintenance functions
// Features: System info, performance monitoring, runtime status, maintenance

function getSystemInfo() {
    try {
        var systemInfo = {
            version: System.GetVersion(),
            startTime: System.GetStartTime(),
            uptime: System.GetUptime(),
            memoryUsage: System.GetMemoryUsage(),
            cpuUsage: System.GetCPUUsage(),
            diskSpace: System.GetDiskSpace(),
            networkStatus: System.GetNetworkStatus()
        };
        
        Diagnostics.Trace("System info retrieved successfully");
        
        return {
            success: true,
            info: systemInfo
        };
    } catch (error) {
        Diagnostics.Trace("Error getting system info: " + error.message);
        return {
            success: false,
            error: error.message
        };
    }
}

function checkSystemHealth() {
    try {
        var health = {
            overall: "Good",
            issues: [],
            warnings: [],
            recommendations: []
        };
        
        var systemInfo = getSystemInfo();
        if (!systemInfo.success) {
            health.issues.push("Cannot retrieve system information");
            health.overall = "Critical";
            return health;
        }
        
        var info = systemInfo.info;
        
        // Check memory usage
        if (info.memoryUsage > 85) {
            health.issues.push("High memory usage: " + info.memoryUsage + "%");
            health.overall = "Warning";
        } else if (info.memoryUsage > 70) {
            health.warnings.push("Moderate memory usage: " + info.memoryUsage + "%");
        }
        
        // Check CPU usage
        if (info.cpuUsage > 90) {
            health.issues.push("High CPU usage: " + info.cpuUsage + "%");
            health.overall = "Critical";
        } else if (info.cpuUsage > 70) {
            health.warnings.push("Moderate CPU usage: " + info.cpuUsage + "%");
        }
        
        // Check disk space
        if (info.diskSpace.freePercentage < 10) {
            health.issues.push("Low disk space: " + info.diskSpace.freePercentage + "% free");
            health.overall = "Critical";
        } else if (info.diskSpace.freePercentage < 20) {
            health.warnings.push("Disk space getting low: " + info.diskSpace.freePercentage + "% free");
        }
        
        // Add recommendations
        if (health.issues.length > 0) {
            health.recommendations.push("Contact system administrator");
            health.recommendations.push("Check system resources");
        }
        
        Diagnostics.Trace("System health check completed: " + health.overall);
        
        return health;
    } catch (error) {
        Diagnostics.Trace("Error checking system health: " + error.message);
        return {
            overall: "Unknown",
            issues: ["Error checking system health: " + error.message],
            warnings: [],
            recommendations: ["Restart system health monitoring"]
        };
    }
}

function performMaintenance(taskType) {
    try {
        var result = { success: false, message: "" };
        
        switch (taskType) {
            case "ClearLogs":
                System.ClearDiagnosticLogs();
                result = { success: true, message: "Diagnostic logs cleared" };
                break;
                
            case "OptimizeMemory":
                System.OptimizeMemory();
                result = { success: true, message: "Memory optimization completed" };
                break;
                
            case "CheckConnections":
                var connections = System.CheckAllConnections();
                var failedCount = connections.filter(c => !c.IsConnected).length;
                result = { 
                    success: true, 
                    message: "Connection check completed. " + failedCount + " failed connections",
                    details: connections
                };
                break;
                
            case "BackupSettings":
                var backupResult = System.BackupSettings();
                result = {
                    success: backupResult.Success,
                    message: backupResult.Success ? "Settings backed up" : backupResult.ErrorMessage
                };
                break;
                
            default:
                result = { success: false, message: "Unknown maintenance task: " + taskType };
        }
        
        Diagnostics.Trace("Maintenance task completed: " + taskType + " - " + result.message);
        
        return result;
    } catch (error) {
        Diagnostics.Trace("Error performing maintenance: " + error.message);
        return {
            success: false,
            message: "Maintenance error: " + error.message
        };
    }
}

function monitorPerformance(duration) {
    try {
        var startTime = new Date();
        var performanceData = [];
        
        var monitoringInterval = setInterval(function() {
            try {
                var currentTime = new Date();
                var elapsedTime = currentTime - startTime;
                
                if (elapsedTime >= duration) {
                    clearInterval(monitoringInterval);
                    
                    var summary = {
                        duration: duration,
                        samples: performanceData.length,
                        averageCPU: performanceData.reduce((sum, d) => sum + d.cpu, 0) / performanceData.length,
                        averageMemory: performanceData.reduce((sum, d) => sum + d.memory, 0) / performanceData.length,
                        maxCPU: Math.max(...performanceData.map(d => d.cpu)),
                        maxMemory: Math.max(...performanceData.map(d => d.memory))
                    };
                    
                    Diagnostics.Trace("Performance monitoring completed: " + JSON.stringify(summary));
                    return summary;
                }
                
                var sample = {
                    timestamp: currentTime,
                    cpu: System.GetCPUUsage(),
                    memory: System.GetMemoryUsage(),
                    activeConnections: System.GetActiveConnectionCount()
                };
                
                performanceData.push(sample);
                
            } catch (monitorError) {
                clearInterval(monitoringInterval);
                Diagnostics.Trace("Performance monitoring error: " + monitorError.message);
            }
        }, 1000);
        
        return { success: true, message: "Performance monitoring started" };
    } catch (error) {
        Diagnostics.Trace("Error starting performance monitoring: " + error.message);
        return {
            success: false,
            error: error.message
        };
    }
}

// Example usage:
var systemInfo = getSystemInfo();
console.log("System uptime: " + systemInfo.info.uptime + " hours");

var health = checkSystemHealth();
console.log("System health: " + health.overall);

var maintenanceResult = performMaintenance("ClearLogs");
var performanceMonitor = monitorPerformance(60000); // Monitor for 1 minute`
            },

            'batch-operations': {
                id: 'batch-operations',
                title: 'Batch Operations',
                category: 'Production',
                description: 'Handle batch processing, production sequences, and workflow management. Use for manufacturing processes, batch tracking, and production automation.',
                isCustom: false,
                code: `// Batch Operations - Siemens WinCC Unified
// Description: Handle batch processing, production sequences, and workflow management
// Use when: Manufacturing processes, batch tracking, production automation
// Features: Batch creation, step execution, progress tracking, quality control

function createBatch(batchId, recipeId, quantity) {
    try {
        var batch = {
            id: batchId,
            recipeId: recipeId,
            quantity: quantity,
            status: "Created",
            startTime: null,
            endTime: null,
            currentStep: 0,
            steps: [],
            quality: {
                passed: false,
                tests: []
            },
            alarms: [],
            data: {}
        };
        
        // Load recipe steps
        var recipe = Recipes(recipeId);
        if (recipe.Exists()) {
            batch.steps = recipe.GetSteps();
        } else {
            throw new Error("Recipe not found: " + recipeId);
        }
        
        // Save batch to system
        Batches.Create(batch);
        
        Diagnostics.Trace("Batch created: " + batchId + " with recipe " + recipeId);
        
        return {
            success: true,
            batch: batch
        };
    } catch (error) {
        Diagnostics.Trace("Error creating batch: " + error.message);
        return {
            success: false,
            error: error.message
        };
    }
}

function startBatch(batchId) {
    try {
        var batch = Batches.Get(batchId);
        if (!batch) {
            throw new Error("Batch not found: " + batchId);
        }
        
        batch.status = "Running";
        batch.startTime = new Date().toISOString();
        batch.currentStep = 0;
        
        // Initialize first step
        if (batch.steps.length > 0) {
            var firstStep = batch.steps[0];
            executeStep(batchId, firstStep);
        }
        
        Batches.Update(batch);
        
        Diagnostics.Trace("Batch started: " + batchId);
        logProduction(batchId, "Batch Started", { recipe: batch.recipeId, quantity: batch.quantity });
        
        return { success: true };
    } catch (error) {
        Diagnostics.Trace("Error starting batch: " + error.message);
        return {
            success: false,
            error: error.message
        };
    }
}

function executeStep(batchId, step) {
    try {
        var batch = Batches.Get(batchId);
        if (!batch) {
            throw new Error("Batch not found: " + batchId);
        }
        
        Diagnostics.Trace("Executing step: " + step.name + " for batch " + batchId);
        
        // Execute step actions
        for (var i = 0; i < step.actions.length; i++) {
            var action = step.actions[i];
            
            switch (action.type) {
                case "SetTag":
                    writeTagValue(action.tagName, action.value);
                    break;
                case "Wait":
                    setTimeout(function() {
                        continueStep(batchId, step);
                    }, action.duration);
                    return; // Exit and wait for timer
                case "CheckCondition":
                    if (!evaluateCondition(action.condition)) {
                        throw new Error("Step condition failed: " + action.condition);
                    }
                    break;
                default:
                    Diagnostics.Trace("Unknown action type: " + action.type);
            }
        }
        
        // Step completed, move to next
        completeStep(batchId, step);
        
        return { success: true };
    } catch (error) {
        Diagnostics.Trace("Error executing step: " + error.message);
        
        // Mark batch as failed
        var batch = Batches.Get(batchId);
        batch.status = "Failed";
        batch.endTime = new Date().toISOString();
        Batches.Update(batch);
        
        return {
            success: false,
            error: error.message
        };
    }
}

function completeStep(batchId, step) {
    try {
        var batch = Batches.Get(batchId);
        batch.currentStep++;
        
        Diagnostics.Trace("Step completed: " + step.name + " for batch " + batchId);
        logProduction(batchId, "Step Completed", { step: step.name, stepNumber: batch.currentStep });
        
        // Check if batch is complete
        if (batch.currentStep >= batch.steps.length) {
            completeBatch(batchId);
        } else {
            // Execute next step
            var nextStep = batch.steps[batch.currentStep];
            executeStep(batchId, nextStep);
        }
        
        Batches.Update(batch);
        
        return { success: true };
    } catch (error) {
        Diagnostics.Trace("Error completing step: " + error.message);
        return {
            success: false,
            error: error.message
        };
    }
}

function completeBatch(batchId) {
    try {
        var batch = Batches.Get(batchId);
        batch.status = "Completed";
        batch.endTime = new Date().toISOString();
        
        // Calculate batch duration
        var duration = new Date(batch.endTime) - new Date(batch.startTime);
        batch.duration = duration;
        
        // Perform quality checks
        var qualityResult = performQualityCheck(batchId);
        batch.quality = qualityResult;
        
        Batches.Update(batch);
        
        Diagnostics.Trace("Batch completed: " + batchId + " in " + (duration / 1000) + " seconds");
        logProduction(batchId, "Batch Completed", { 
            duration: duration / 1000, 
            quality: qualityResult.passed ? "Pass" : "Fail"
        });
        
        return { 
            success: true, 
            duration: duration,
            quality: qualityResult
        };
    } catch (error) {
        Diagnostics.Trace("Error completing batch: " + error.message);
        return {
            success: false,
            error: error.message
        };
    }
}

function performQualityCheck(batchId) {
    try {
        var qualityTests = [
            { name: "Temperature Check", tag: "Final_Temperature", min: 70, max: 80 },
            { name: "Pressure Check", tag: "Final_Pressure", min: 2.0, max: 2.5 },
            { name: "pH Check", tag: "Final_pH", min: 6.5, max: 7.5 }
        ];
        
        var results = {
            passed: true,
            tests: []
        };
        
        for (var i = 0; i < qualityTests.length; i++) {
            var test = qualityTests[i];
            var value = readTagValue(test.tag);
            var passed = value >= test.min && value <= test.max;
            
            results.tests.push({
                name: test.name,
                value: value,
                min: test.min,
                max: test.max,
                passed: passed
            });
            
            if (!passed) {
                results.passed = false;
            }
        }
        
        Diagnostics.Trace("Quality check completed for batch " + batchId + ": " + 
            (results.passed ? "PASS" : "FAIL"));
        
        return results;
    } catch (error) {
        Diagnostics.Trace("Error performing quality check: " + error.message);
        return {
            passed: false,
            tests: [],
            error: error.message
        };
    }
}

// Example usage:
var newBatch = createBatch("BATCH_20241227_001", "RECIPE_STANDARD", 1000);
if (newBatch.success) {
    startBatch(newBatch.batch.id);
}`
            }
        };

        // Add all default templates
        for (const [key, template] of Object.entries(defaultTemplates)) {
            this.addTemplate(template);
        }
    }

    // Load custom templates from localStorage
    loadCustomTemplates() {
        try {
            const saved = localStorage.getItem('wincc-custom-templates');
            if (saved) {
                const customTemplates = JSON.parse(saved);
                for (const template of customTemplates) {
                    this.addTemplate(template);
                }
            }
        } catch (error) {
            console.error('Error loading custom templates:', error);
        }
    }

    // Save custom templates to localStorage
    saveCustomTemplates() {
        try {
            const customTemplates = Array.from(this.templates.values())
                .filter(template => template.isCustom);
            localStorage.setItem('wincc-custom-templates', JSON.stringify(customTemplates));
            return true;
        } catch (error) {
            console.error('Error saving custom templates:', error);
            return false;
        }
    }

    // Add a new template
    addTemplate(template) {
        if (!template.id || !template.title || !template.code) {
            throw new Error('Template must have id, title, and code');
        }

        this.templates.set(template.id, template);
        
        // Add to category
        const category = template.category || 'Custom';
        if (!this.categories.has(category)) {
            this.categories.set(category, []);
        }
        
        const categoryTemplates = this.categories.get(category);
        if (!categoryTemplates.find(t => t.id === template.id)) {
            categoryTemplates.push(template);
        }

        // Save if it's a custom template
        if (template.isCustom) {
            this.saveCustomTemplates();
        }
    }

    // Remove a template
    removeTemplate(templateId) {
        const template = this.templates.get(templateId);
        if (!template) return false;

        // Don't allow removing default templates
        if (!template.isCustom) {
            throw new Error('Cannot remove default templates');
        }

        this.templates.delete(templateId);
        
        // Remove from category
        const categoryTemplates = this.categories.get(template.category);
        if (categoryTemplates) {
            const index = categoryTemplates.findIndex(t => t.id === templateId);
            if (index > -1) {
                categoryTemplates.splice(index, 1);
            }
        }

        this.saveCustomTemplates();
        return true;
    }

    // Get template by ID
    getTemplate(templateId) {
        return this.templates.get(templateId);
    }

    // Get all templates in a category
    getTemplatesByCategory(category) {
        return this.categories.get(category) || [];
    }

    // Get all categories
    getCategories() {
        return Array.from(this.categories.keys());
    }

    // Get all templates
    getAllTemplates() {
        return Array.from(this.templates.values());
    }

    // Create a new custom template
    createCustomTemplate(title, description, category, code) {
        const id = 'custom-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
        const template = {
            id: id,
            title: title,
            category: category || 'Custom',
            description: description || 'Custom template',
            isCustom: true,
            code: code,
            createdAt: new Date().toISOString()
        };

        this.addTemplate(template);
        return template;
    }

    // Export templates to JSON
    exportTemplates() {
        return JSON.stringify(this.getAllTemplates(), null, 2);
    }

    // Import templates from JSON
    importTemplates(jsonData) {
        try {
            const templates = JSON.parse(jsonData);
            let imported = 0;
            
            for (const template of templates) {
                if (template.id && template.title && template.code) {
                    template.isCustom = true; // Mark as custom when importing
                    this.addTemplate(template);
                    imported++;
                }
            }
            
            return imported;
        } catch (error) {
            throw new Error('Invalid template data: ' + error.message);
        }
    }
}

// Create global template manager instance
const templateManager = new TemplateManager();

// Backward compatibility - expose templates in the old format
const WinCCTemplates = {};
templateManager.getAllTemplates().forEach(template => {
    WinCCTemplates[template.id] = template;
});