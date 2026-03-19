import React from "react";
import { View, Text, ScrollView } from "react-native";

function SectionTitle({ children }: { children: string }) {
  return (
    <Text
      className="text-white font-[JetBrainsMonoNL-Bold]"
      style={{ fontSize: 22, marginTop: 32, marginBottom: 12 }}
    >
      {children}
    </Text>
  );
}

function SubTitle({ children }: { children: string }) {
  return (
    <Text
      className="text-white font-[JetBrainsMonoNL-Bold]"
      style={{ fontSize: 15, marginTop: 20, marginBottom: 8 }}
    >
      {children}
    </Text>
  );
}

function Body({ children }: { children: React.ReactNode }) {
  return (
    <Text
      className="font-[JetBrainsMonoNL-Regular]"
      style={{ color: "#b0b4ba", fontSize: 15, lineHeight: 24, marginBottom: 8 }}
    >
      {children}
    </Text>
  );
}

function Bullet({ children }: { children: string }) {
  return (
    <Text
      className="font-[JetBrainsMonoNL-Regular]"
      style={{ color: "#b0b4ba", fontSize: 15, lineHeight: 24, marginBottom: 4, paddingLeft: 16 }}
    >
      {"\u2022 "}
      {children}
    </Text>
  );
}

export default function PrivacyScene() {
  return (
    <View className="flex-1 bg-black">
      <ScrollView className="flex-1">
        <View
          style={{
            maxWidth: 1100,
            width: "100%",
            alignSelf: "center",
            padding: 32,
          }}
        >
          <Text
            className="text-white font-[JetBrainsMonoNL-Bold]"
            style={{ fontSize: 32 }}
          >
            Privacy Policy
          </Text>
          <Text
            className="font-[JetBrainsMonoNL-Regular]"
            style={{ color: "#b0b4ba", fontSize: 14, marginTop: 8, marginBottom: 24 }}
          >
            Last Updated: March 19, 2026
          </Text>

          <Body>
            Jon Samp ("we," "us," or "our") operates the QRU? mobile application
            (the "App"). This Privacy Policy explains what information we collect,
            how we use it, and your choices.
          </Body>

          <SectionTitle>Information We Collect</SectionTitle>

          <SubTitle>Information You Provide</SubTitle>
          <Body>
            All data created in the App — including scanned QR codes, URLs, and
            scan history — is stored locally on your device. This data is not
            transmitted to us or any third party.
          </Body>

          <SubTitle>Camera Access</SubTitle>
          <Body>
            The App requests access to your device's camera solely for the purpose
            of scanning QR codes. Camera data is processed on-device in real time
            and is never recorded, stored, or transmitted.
          </Body>

          <SubTitle>Automatically Collected Information</SubTitle>
          <Body>
            The App uses Expo Insights and Expo EAS Observe to collect anonymous
            usage and performance data. This may include app launches, session
            duration, crash reports, and basic device metadata (such as platform,
            OS version, and app version). This data is sent to Expo's servers and
            does not include personal information or any content you scan.
          </Body>

          <SectionTitle>Third-Party Services</SectionTitle>
          <Body>
            The App uses the following third-party services that may process
            limited data:
          </Body>
          <Bullet>
            Expo Updates — Provides over-the-air app updates. When checking for
            updates, basic request metadata (such as app version and platform)
            may be sent to Expo's update servers. No personal information is
            included.
          </Bullet>
          <Bullet>
            Expo Insights — Collects anonymous app usage data such as session
            counts and app launches to help us understand how the App is used.
            No personal information is collected.
          </Bullet>
          <Bullet>
            Expo EAS Observe — Collects crash reports and performance data to
            help us identify and fix issues. This may include stack traces,
            device metadata, and app state at the time of a crash. No personal
            information is included.
          </Bullet>

          <SectionTitle>What We Do Not Collect</SectionTitle>
          <Body>We do not collect, store, or transmit:</Body>
          <Bullet>Names, email addresses, or phone numbers</Bullet>
          <Bullet>Location data</Bullet>
          <Bullet>Device identifiers or advertising IDs</Bullet>
          <Bullet>Photos, contacts, or calendar data</Bullet>
          <Bullet>Health or fitness data</Bullet>
          <Bullet>Browsing history or personal usage analytics</Bullet>
          <Body>
            The App does not require an account or login. There is no user tracking
            across sessions or devices.
          </Body>

          <SectionTitle>Data Storage and Security</SectionTitle>
          <Body>
            Your scan history and app data are stored locally on your device using
            AsyncStorage. No data is transmitted to external servers. All scanned
            QR code data remains entirely on your device.
          </Body>

          <SectionTitle>Data Retention</SectionTitle>
          <Body>
            Locally stored data (scan history) remains on your device until you
            delete it within the App or uninstall the App.
          </Body>

          <SectionTitle>Your Rights and Choices</SectionTitle>
          <Bullet>
            Camera: You can revoke camera access at any time through your device's
            settings. The App will prompt you to grant access again when needed.
          </Bullet>
          <Bullet>
            Local data: You can delete individual scan entries within the App.
            Uninstalling the App removes all locally stored data.
          </Bullet>
          <Bullet>
            Data access and deletion: To request access to or deletion of any data
            associated with your use of the App, contact us at sampjon@gmail.com.
          </Bullet>

          <SectionTitle>Children's Privacy</SectionTitle>
          <Body>
            The App is not directed at children under 16. We do not knowingly
            collect personal information from children. If you believe a child has
            provided us with personal information, please contact us and we will
            delete it.
          </Body>

          <SectionTitle>International Users</SectionTitle>
          <Body>
            European Economic Area (GDPR): Since we collect minimal data and do not
            process personal information beyond what is described above, our legal
            basis for processing is legitimate interest in providing the App's
            functionality. You have the right to access, correct, or delete your
            data by contacting us.
          </Body>
          <Body>
            California (CCPA): We do not sell personal information. We do not share
            personal information for cross-context behavioral advertising.
          </Body>

          <SectionTitle>Changes to This Policy</SectionTitle>
          <Body>
            We may update this Privacy Policy from time to time. Changes will be
            reflected by updating the "Last Updated" date above. Continued use of
            the App after changes constitutes acceptance of the updated policy.
          </Body>

          <SectionTitle>Contact Us</SectionTitle>
          <Body>
            If you have questions about this Privacy Policy, contact us at:
            sampjon@gmail.com
          </Body>
        </View>
      </ScrollView>
    </View>
  );
}
