/**
 * WidgetState enum represents the various states of the chat widget.
 * Each state indicates a specific phase in the chat lifecycle.
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