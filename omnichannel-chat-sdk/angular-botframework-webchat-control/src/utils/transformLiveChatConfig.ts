export class ConfigurationManager {
    public static canUploadAttachment: boolean = false;
}

const transformLiveChatConfig = (liveChatConfig: any): ConfigurationManager => {
    const canUploadAttachment = (liveChatConfig as any)["LiveWSAndLiveChatEngJoin"]["msdyn_enablefileattachmentsforcustomers"] === "true" || false;
    ConfigurationManager.canUploadAttachment = canUploadAttachment;
    return ConfigurationManager;
};

export default transformLiveChatConfig;
