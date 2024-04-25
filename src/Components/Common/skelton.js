import * as React from 'react';
import ContentLoader from 'react-content-loader';

const random = Math.random() * (1 - 0.7) + 0.7;
export const TwoLineCardSkelton = (props) => (
    <ContentLoader height="120" width="100%" speed={2}>
        <circle cx="50" cy="52" r="25" />

        <rect x="7%" y="30" rx="5" ry="5" width="17%" height="15" />
        <rect x="25%" y="30" rx="5" ry="5" width="17%" height="15" />
        <rect x="43%" y="30" rx="5" ry="5" width="12%" height="15" />
        <rect x="56%" y="30" rx="5" ry="5" width="12%" height="15" />
        <rect x="69%" y="30" rx="5" ry="5" width="12%" height="15" />
        <rect x="82%" y="30" rx="5" ry="5" width="12%" height="15" />

        <rect x="7%" y="60" rx="5" ry="5" width="17%" height="15" />
        <rect x="25%" y="60" rx="5" ry="5" width="17%" height="15" />
        <rect x="43%" y="60" rx="5" ry="5" width="12%" height="15" />
        <rect x="56%" y="60" rx="5" ry="5" width="12%" height="15" />
        <rect x="69%" y="60" rx="5" ry="5" width="12%" height="15" />
        <rect x="82%" y="60" rx="5" ry="5" width="12%" height="15" />

        <rect x="96%" y="30" rx="5" ry="5" width="3%" height="10" />
        <rect x="96%" y="46" rx="5" ry="5" width="3%" height="10" />
        <rect x="96%" y="62" rx="5" ry="5" width="3%" height="10" />
    </ContentLoader>
);

export const CardSkelton = (props) => (
    <ContentLoader height="150" width="100%" speed={2}>
        <rect x="30" y="15" rx="4" ry="4" width="200" height="12" />
        <rect x="260" y="15" rx="6" ry="6" width="200" height="12" />
        <rect x="480" y="15" rx="6" ry="6" width="200" height="12" />
        <rect x="690" y="15" rx="6" ry="6" width="200" height="12" />

        <rect x="30" y="50" rx="4" ry="4" width="200" height="12" />
        <rect x="260" y="50" rx="6" ry="6" width="200" height="12" />
        <rect x="480" y="50" rx="6" ry="6" width="200" height="12" />
        <rect x="690" y="50" rx="6" ry="6" width="200" height="12" />

        <rect x="30" y="85" rx="4" ry="4" width="200" height="12" />
        <rect x="260" y="85" rx="6" ry="6" width="200" height="12" />
        <rect x="480" y="85" rx="6" ry="6" width="200" height="12" />
        <rect x="690" y="85" rx="6" ry="6" width="200" height="12" />

        <rect x="30" y="120" rx="4" ry="4" width="200" height="12" />
        <rect x="260" y="120" rx="6" ry="6" width="200" height="12" />
        <rect x="480" y="120" rx="6" ry="6" width="200" height="12" />
        <rect x="690" y="120" rx="6" ry="6" width="200" height="12" />
    </ContentLoader>
);

export const TableSkelton = (props) => (
    <div className="overflow-auto">
        <ContentLoader width={1200} height={400} speed={2}>
            <rect x="20" y="37" width="1137" height="15" />
            <rect x="20" y="71" width="1137" height="15" />

            <rect x="20" y="52" width="10" height="20" />
            <rect x="47" y="52" width="20" height="19" />
            <rect x="152" y="52" width="36" height="19" />
            <rect x="357" y="52" width="45" height="19" />
            <rect x="487" y="52" width="36" height="19" />
            <rect x="692" y="52" width="39" height="19" />
            <rect x="816" y="52" width="36" height="19" />
            <rect x="937" y="52" width="41" height="19" />
            <rect x="1147" y="52" width="10" height="19" />

            <rect x="27" y="109" rx="4" ry="4" width="20" height="20" />
            <rect x="67" y="110" rx="10" ry="10" width="85" height="19" />
            <rect x="188" y="111" rx="10" ry="10" width="169" height="19" />
            <rect x="402" y="110" rx="10" ry="10" width="85" height="19" />
            <rect x="523" y="111" rx="10" ry="10" width="169" height="19" />
            <rect x="731" y="109" rx="10" ry="10" width="85" height="19" />
            <rect x="852" y="108" rx="10" ry="10" width="85" height="19" />

            <rect x="26" y="166" rx="4" ry="4" width="20" height="20" />
            <rect x="66" y="167" rx="10" ry="10" width="85" height="19" />
            <rect x="187" y="168" rx="10" ry="10" width="169" height="19" />
            <rect x="401" y="167" rx="10" ry="10" width="85" height="19" />
            <rect x="522" y="168" rx="10" ry="10" width="169" height="19" />
            <rect x="730" y="166" rx="10" ry="10" width="85" height="19" />
            <rect x="851" y="165" rx="10" ry="10" width="85" height="19" />

            <rect x="26" y="228" rx="4" ry="4" width="20" height="20" />
            <rect x="66" y="229" rx="10" ry="10" width="85" height="19" />
            <rect x="187" y="230" rx="10" ry="10" width="169" height="19" />
            <rect x="401" y="229" rx="10" ry="10" width="85" height="19" />
            <rect x="522" y="230" rx="10" ry="10" width="169" height="19" />
            <rect x="730" y="228" rx="10" ry="10" width="85" height="19" />
            <rect x="851" y="227" rx="10" ry="10" width="85" height="19" />

            <rect x="26" y="286" rx="4" ry="4" width="20" height="20" />
            <rect x="66" y="287" rx="10" ry="10" width="85" height="19" />
            <rect x="187" y="288" rx="10" ry="10" width="169" height="19" />
            <rect x="401" y="287" rx="10" ry="10" width="85" height="19" />
            <rect x="522" y="288" rx="10" ry="10" width="169" height="19" />
            <rect x="730" y="286" rx="10" ry="10" width="85" height="19" />
            <rect x="851" y="285" rx="10" ry="10" width="85" height="19" />

            <rect x="26" y="349" rx="4" ry="4" width="20" height="20" />
            <rect x="66" y="350" rx="10" ry="10" width="85" height="19" />
            <rect x="187" y="351" rx="10" ry="10" width="169" height="19" />
            <rect x="401" y="350" rx="10" ry="10" width="85" height="19" />
            <rect x="522" y="351" rx="10" ry="10" width="169" height="19" />
            <rect x="730" y="349" rx="10" ry="10" width="85" height="19" />
            <rect x="851" y="348" rx="10" ry="10" width="85" height="19" />

            <rect x="978" y="108" rx="10" ry="10" width="169" height="19" />
            <rect x="977" y="165" rx="10" ry="10" width="169" height="19" />
            <rect x="977" y="227" rx="10" ry="10" width="169" height="19" />
            <rect x="977" y="285" rx="10" ry="10" width="169" height="19" />
            <rect x="977" y="348" rx="10" ry="10" width="169" height="19" />
        </ContentLoader>
    </div>
);

export const CardHeaderBodySkelton = () => (
    <ContentLoader height="380" width="100%" speed={2}>
        <rect x="5%" y="30" rx="4" ry="4" width="15%" height="25" />
        <rect x="75%" y="30" rx="4" ry="4" width="20%" height="25" />

        <rect x="5%" y="90" rx="4" ry="4" width="35%" height="25" />
        <rect x="80%" y="90" rx="4" ry="4" width="15%" height="25" />

        <rect x="5%" y="150" rx="4" ry="4" width="7%" height="38" />
        <rect x="15%" y="155" rx="4" ry="4" width="50%" height="10" />
        <rect x="15%" y="170" rx="4" ry="4" width="50%" height="10" />
        <rect x="85%" y="160" rx="4" ry="4" width="12%" height="10" />

        <rect x="5%" y="210" rx="4" ry="4" width="7%" height="38" />
        <rect x="15%" y="215" rx="4" ry="4" width="50%" height="10" />
        <rect x="15%" y="230" rx="4" ry="4" width="50%" height="10" />
        <rect x="85%" y="220" rx="4" ry="4" width="12%" height="10" />

        <rect x="5%" y="260" rx="4" ry="4" width="7%" height="38" />
        <rect x="15%" y="265" rx="4" ry="4" width="50%" height="10" />
        <rect x="15%" y="280" rx="4" ry="4" width="50%" height="10" />
        <rect x="85%" y="270" rx="4" ry="4" width="12%" height="10" />

        <rect x="5%" y="310" rx="4" ry="4" width="7%" height="38" />
        <rect x="15%" y="315" rx="4" ry="4" width="50%" height="10" />
        <rect x="15%" y="330" rx="4" ry="4" width="50%" height="10" />
        <rect x="85%" y="320" rx="4" ry="4" width="12%" height="10" />
    </ContentLoader>
);
export const AvatarTwoLineSkelton = () => (
    <ContentLoader height="100%" width="100%">
        <circle cx="10%" cy="30" r="20" />
        <rect x="23%" y="18" rx="3" ry="3" width="70%" height="7" />
        <rect x="23%" y="38" rx="3" ry="3" width="70%" height="6" />

        <circle cx="10%" cy="95" r="20" />
        <rect x="23%" y="83" rx="3" ry="3" width="70%" height="7" />
        <rect x="23%" y="103" rx="3" ry="3" width="70%" height="6" />
    </ContentLoader>
);

export const CommonLoadingSkelton = () => (
    <ContentLoader height="100%" width="100%">
        <circle cx="40%" cy="50%" r="20" />
        <circle cx="50%" cy="50%" r="20" />
        <circle cx="60%" cy="50%" r="20" />
    </ContentLoader>
);
export const AssessmentSkelton = (props) => (
    <ContentLoader height="300" width="100%">
        <rect x="10" y="5" rx="4" ry="4" width="100%" height="40" />
        <rect x="10" y="60" rx="0" ry="0" width="100%" height="10" />
        <rect x="10" y="80" rx="0" ry="0" width="100%" height="10" />
        <rect x="10" y="100" rx="0" ry="0" width="100%" height="10" />

        <rect x="10" y="130" rx="4" ry="4" width="100%" height="40" />
        <rect x="10" y="185" rx="0" ry="0" width="100%" height="10" />
        <rect x="10" y="205" rx="0" ry="0" width="100%" height="10" />
        <rect x="10" y="225" rx="0" ry="0" width="100%" height="10" />
    </ContentLoader>
);

export const ClinicianSkelton = (props) => (
    <ContentLoader height="210" width="100%">
        <rect x="15" y="15" rx="4" ry="4" width="90%" height="50" />
        <rect x="15" y="80" rx="4" ry="4" width="90%" height="50" />
        <rect x="15" y="145" rx="4" ry="4" width="90%" height="50" />
    </ContentLoader>
);
export const AssessmentMemberSkelton = () => (
    <ContentLoader height="80" width="100%">
        <rect x="15" y="0" rx="4" ry="4" width="20%" height="30" />
        <rect x="25%" y="0" rx="4" ry="4" width="20%" height="30" />
        <rect x="50%" y="0" rx="4" ry="4" width="20%" height="30" />
        <rect x="75%" y="0" rx="4" ry="4" width="20%" height="30" />

        <rect x="15" y="45" rx="4" ry="4" width="20%" height="30" />
        <rect x="25%" y="45" rx="4" ry="4" width="20%" height="30" />
        <rect x="50%" y="45" rx="4" ry="4" width="20%" height="30" />
        <rect x="75%" y="45" rx="4" ry="4" width="20%" height="30" />
    </ContentLoader>
);
export const DasboardCaseLoadSkelton = () => (
    <ContentLoader height="250" width="100%">
        {[0, 4, 8, 12, 16, 20, 24, 28, 32, 36, 40, 44, 48, 52, 56, 60, 64, 68, 72, 76, 80, 84, 88, 92, 96, 100].map((i) => (
            <>
                <rect x={`${i}%`} y="5" rx="4" ry="4" width="3%" height="100%" />
            </>
        ))}
    </ContentLoader>
);
export const AssignmentLog = () => (
    <ContentLoader height="400" width="100%">
        <rect x="15" y="10" rx="4" ry="4" width="90%" height="30" />

        <rect x="30" y="70" rx="4" ry="4" width="85%" height="30" />
        <rect x="30" y="105" rx="4" ry="4" width="85%" height="30" />
        <rect x="30" y="140" rx="4" ry="4" width="85%" height="30" />

        <rect x="30" y="200" rx="4" ry="4" width="85%" height="30" />
        <rect x="30" y="235" rx="4" ry="4" width="85%" height="30" />
        <rect x="30" y="270" rx="4" ry="4" width="85%" height="30" />
    </ContentLoader>
);
export const RecordingsSkelton = () => (
    <ContentLoader height="400" width="100%">
        <rect x="0" y="0" rx="4" ry="4" width="90%" height="5" />
        <rect x="0" y="0" rx="4" ry="4" width="5" height="100" />
        <circle cx="10%" cy="50" r="20" />
        <rect x="20%" y="35" rx="4" ry="4" width="60%" height="30" />
        <rect x="0" y="100" rx="4" ry="4" width="90%" height="5" />
        <rect x="90%" y="0" rx="4" ry="4" width="5" height="100" />
    </ContentLoader>
);
