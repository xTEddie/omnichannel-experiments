/**
 * WidgetState enum represents the various states of the chat widget.
 * Each state indicates a specific phase in the chat lifecycle.
 * 
 * Examples: 
 * - Normal chat: UNKNOWN -> READY -> LOADING -> CHAT -> ENDED -> READY
 * - Out of business hours chat: UNKNOWN -> READY -> OFFLINE
 * - Pre-chat survey: UNKNOWN -> READY -> PRECHATSURVEY -> PRECHATSURVEYSUBMITTED -> LOADING -> CHAT -> ENDED -> READY
 * - Post-chat survey on embed mode: UNKNOWN -> READY -> LOADING -> CHAT -> ENDED -> POSTCHATSURVEY -> READY
 * - Post-chat survey on link mode: UNKNOWN -> READY -> LOADING -> CHAT -> ENDED -> READONLY -> READY
 * - Chat in error state: UNKNOWN -> READY -> [ANY STATE] -> ERROR -> READY
 * - Minimizing chat: UKNOWN -> READY -> [ANY STATE] -> MINIMIZED -> [RECENT STATE] -> [...]
 */
enum WidgetState {
  UNKNOWN = 'UNKNOWN', // Initial state of the widget, not yet determined
  READY = 'READY', // Widget is fully loaded and ready to be used
  PRECHATSURVEY = 'PRECHATSURVEY', // Rendering of pre-chat survey
  PRECHATSURVEYSUBMITTED = 'PRECHATSURVEYSUBMITTED', // Pre-chat survey has been submitted
  LOADING = 'LOADING', // Chat has started but not fully ready to chat yet
  CHAT = 'CHAT', // Chat is in progress
  ENDED = 'ENDED', // Chat has ended by the user or agent
  READONLY = 'READONLY', // Chat has ended but is in read-only mode to perform post-chat tasks such as post-chat survey
  POSTCHATSURVEY = 'POSTCHATSURVEY', // Rendering of post-chat survey on embed mode
  MINIMIZED = 'MINIMIZED', // Chat is minimized
  OFFLINE = 'OFFLINE', // Chat is out of business hours
  ERROR = 'ERROR' // Chat is in error state
};

export default WidgetState;