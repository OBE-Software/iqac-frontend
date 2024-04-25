import React from 'react';
import { Document, Page, Text, View, StyleSheet, PDFViewer, BlobProvider } from '@react-pdf/renderer';

const styles = StyleSheet.create({
    page: {
        flexDirection: 'row',
        backgroundColor: '#E4E4E4',
        color: 'red'
    },
    section: {
        margin: 10,
        padding: 10,
        flexGrow: 1
    },
    header: {
        border: '1px solid red',
        fontSize: 20,
        marginBottom: 10
    },
    row: {
        flexDirection: 'row',
        marginBottom: 5
    }
});

const MyDocument = ({ data }) => (
    <Document className="d-none">
        <Page style={styles.page}>
            <View style={styles.section}>
                <Text style={styles.header}>User Data</Text>
                {data.map((item) => (
                    <View key={item.id} style={styles.row}>
                        <Text>{item.name}</Text>
                        <Text>{item.age}</Text>
                    </View>
                ))}
            </View>
        </Page>
    </Document>
);

const ExportToPdf = ({ data }) => {
    const downloadPDF = () => {
        const handleBlob = (blob) => {
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'userdata.pdf');
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link); // Clean up after download
        };

        return (
            <BlobProvider document={<MyDocument data={data} />}>
                {({ blob }) => <button onClick={() => handleBlob(blob)}>Download PDF</button>}
            </BlobProvider>
        );
    };

    return (
        <>
            {downloadPDF()}
            {/* <PDFViewer className="w-100 h-100"> */}
                <MyDocument data={data} />
            {/* </PDFViewer> */}
        </>
    );
};

export default ExportToPdf;
