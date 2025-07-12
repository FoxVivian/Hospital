import express from 'express';
import mongoose, { connect, mongo } from 'mongoose';
import dotenv from 'dotenv';
import connectToDatabase from './DBConnect/DB.js';

import userRouter from './routes/userRoute.js';
import appointmentRouter from './routes/appointmentRoutes.js';
import dasboardstatsRouter from './routes/dashboardStatsRoutes.js';
import insuranceProviderRouter from './routes/insuranceProviderRoutes.js';
import invoiceItemRouter from './routes/invoiceItemRoutes.js';
import invoiceRouter from './routes/invoiceRoutes.js';
import labEquipmentRouter from './routes/labEquipmentRoutes.js';
import labNormalRangeRouter from './routes/labNormalRangeRoutes.js';
import labParameterRouter from './routes/labParameterRoutes.js';
import labQualityControlRouter from './routes/labQualityControlRoutes.js';
import labResultRouter from './routes/labResultRoutes.js';
import labTestRouter from './routes/labTestRoutes.js';
import labTestTemplateRouter from './routes/labTestTemplateRoutes.js';
import labWorkflowRouter from './routes/labWorkflowRoutes.js';
import medicalRecordRouter from './routes/medicalRecordRoutes.js';
import medicineRouter from './routes/medicineRoutes.js';
import patientRouter from './routes/patientRoutes.js';
import paymentTransactionRouter from './routes/paymentTransactionRoutes.js';
import prescriptionRouter from './routes/prescriptionRoutes.js';
import servicePriceRouter from './routes/servicePriceRoutes.js';
import stockAlertRouter from './routes/stockAlertRoutes.js';
import stockTransactionRouter from './routes/stockTransactionRoutes.js';
import supplierRouter from './routes/supplierRoutes.js';

const app = express();
app.use(express.json());

connectToDatabase();

app.use('/users', userRouter);
app.use('/appointments', appointmentRouter);
app.use('/dashboard-stats', dasboardstatsRouter);
app.use('/insurance-providers', insuranceProviderRouter);
app.use('/invoice-items', invoiceItemRouter);
app.use('/invoices', invoiceRouter);
app.use('/lab-equipments', labEquipmentRouter);
app.use('/lab-normal-ranges', labNormalRangeRouter);
app.use('/lab-parameters', labParameterRouter);
app.use('/lab-quality-controls', labQualityControlRouter);
app.use('/lab-results', labResultRouter);
app.use('/lab-tests', labTestRouter);
app.use('/lab-test-templates', labTestTemplateRouter);
app.use('/lab-workflows', labWorkflowRouter);
app.use('/medical-records', medicalRecordRouter);
app.use('/medicines', medicineRouter);
app.use('/patients', patientRouter);
app.use('/payment-transactions', paymentTransactionRouter);
app.use('/prescriptions', prescriptionRouter);
app.use('/service-prices', servicePriceRouter);
app.use('/stock-alerts', stockAlertRouter);
app.use('/stock-transactions', stockTransactionRouter);
app.use('/suppliers', supplierRouter);


app.listen(3000, () => {
    console.log('Server is running on port 3000');
});