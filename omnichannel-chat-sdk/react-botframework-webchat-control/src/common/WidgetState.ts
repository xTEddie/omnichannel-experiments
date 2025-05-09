enum WidgetState {
  UNKNOWN = 'UNKNOWN',
  READY = 'READY', // Widget is ready to be used
  PRECHATSURVEY = 'PRECHATSURVEY', // Rendering pre-chat survey
  PRECHATSURVEYSUBMITTED = 'PRECHATSURVEYSUBMITTED', // Pre-chat survey has been submitted
  LOADING = 'LOADING', // Chat started but not fully completed yet
  CHAT = 'CHAT', // Chat is in progress
  ENDED = 'ENDED', // Chat has ended
  READONLY = 'READONLY', // Chat has ended but in read-only mode to display post-chat survey
  POSTCHATSURVEY = 'POSTCHATSURVEY', // Rendering post-chat survey on embed mode
  MINIMIZED = 'MINIMIZED', // Chat is minimized
  OFFLINE = 'OFFLINE', // Chat is out of business hours
  ERROR = 'ERROR' // Chat is in error state
};

export default WidgetState;