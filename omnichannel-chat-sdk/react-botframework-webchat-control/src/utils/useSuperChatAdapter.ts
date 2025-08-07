import { shareObservable } from "./shareObservable";

interface IActivitySubscriber {
  // Observer object
  observer: any;

  // Handler to pass next activity
  next(activity: any): Promise<any>;

  // Condition whether to modify activity
  applicable?(activity: any): boolean;

  // Modify activity
  apply?(activity: any): Promise<any>;
}

class DefaultActivitySubscriber implements IActivitySubscriber {
  public observer: any;
  
  public async next(activity: any) {
    this.observer.next(activity);
    return false;
  }
}

class AddActivitySubscriber implements IActivitySubscriber {
  public observer: any;

  constructor() {
    window.addEventListener('CHAT_WIDGET/ADD_ACTIVITY', (event: any) => {
      if (event?.detail?.payload?.activity) {
        this.observer.next(event.detail.payload.activity);
      }
    });
  }

  public async next(activity: any) {
    return activity;
  }
}

/**
 * Wrapper around the original chat adapter to allow 
 * adding new subscribers to modify activities.
 */
class SuperChatAdapter {
  public chatAdapter: any;
  public activityObserver: any;
  private subscribers: any[];

  public constructor(chatAdapter: any) {
    this.subscribers = [];
    this.chatAdapter = {
      ...chatAdapter,
      activity$: shareObservable(
        new (window as any).Observable((observer: any) => {
          this.activityObserver = observer;
          const abortController = new (window as any).AbortController();

          (async () => {
            try {
              for await (let activity of (chatAdapter as any).activities({ signal: abortController.signal })) {
                for (const subscriber of [...this.subscribers, new DefaultActivitySubscriber()]) {
                  subscriber.observer = this.activityObserver;
                  activity = await subscriber.next(activity);
                  if (!activity) {
                    break;
                  }
                }
              }

              observer.complete();
            } catch (error) {
              observer.error(error);
            }
          })();

          return () => {
            abortController.abort();
          };
        })
      )
    };
  }

  public addSubscriber(subscriber: any): void {
    this.subscribers.push(subscriber);
  }
}

const useSuperChatAdapter = (chatAdapter: any) => {
  let adapter = new SuperChatAdapter(chatAdapter);
  adapter.addSubscriber(new AddActivitySubscriber());
  return adapter.chatAdapter;
};

export default useSuperChatAdapter;