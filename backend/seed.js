import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Scheme from './src/models/Scheme.js';

dotenv.config();

const schemes = [
    {
        name: 'PM-KISAN (Pradhan Mantri Kisan Samman Nidhi)',
        category: 'Agriculture',
        description: 'Financial support to farmers providing income support of ₹6000 per year in three equal installments.',
        eligibility_rules: {
            age: { min: 18, max: 100 },
            income: { min: 0, max: 200000 },
            states: ['All'],
            occupation: 'Farmer'
        },
        documents_required: ['Aadhaar Card', 'Land Ownership Documents', 'Bank Account Details', 'Passport Size Photo'],
        benefits: '₹6000 per year in three installments of ₹2000 each, directly transferred to bank account'
    },
    {
        name: 'Ayushman Bharat (PM-JAY)',
        category: 'Health',
        description: 'Health insurance scheme providing coverage of up to ₹5 lakhs per family per year for secondary and tertiary care hospitalization.',
        eligibility_rules: {
            age: { min: 0, max: 100 },
            income: { min: 0, max: 500000 },
            states: ['All']
        },
        documents_required: ['Aadhaar Card', 'Ration Card', 'Income Certificate', 'Address Proof'],
        benefits: 'Health cover of ₹5 lakhs per family per year, cashless treatment at empaneled hospitals'
    },
    {
        name: 'Sukanya Samriddhi Yojana',
        category: 'Education',
        description: 'Savings scheme for girl child with attractive interest rates and tax benefits.',
        eligibility_rules: {
            age: { min: 0, max: 10 },
            income: { min: 0, max: 1000000 },
            states: ['All'],
            gender: 'Female'
        },
        documents_required: ['Birth Certificate of Girl Child', 'Aadhaar Card of Parent', 'PAN Card', 'Address Proof'],
        benefits: 'High interest rate (currently 8.2%), tax benefits under Section 80C, maturity amount tax-free'
    },
    {
        name: 'PM Awas Yojana (Urban)',
        category: 'Housing',
        description: 'Affordable housing scheme for economically weaker sections and low-income groups in urban areas.',
        eligibility_rules: {
            age: { min: 18, max: 70 },
            income: { min: 0, max: 1800000 },
            states: ['All']
        },
        documents_required: ['Aadhaar Card', 'Income Certificate', 'Property Documents', 'Bank Account Details', 'Caste Certificate (if applicable)'],
        benefits: 'Interest subsidy on home loans, direct assistance for house construction, affordable rental housing'
    },
    {
        name: 'Pradhan Mantri Mudra Yojana',
        category: 'Business',
        description: 'Provides loans up to ₹10 lakhs to non-corporate, non-farm small/micro enterprises.',
        eligibility_rules: {
            age: { min: 18, max: 65 },
            income: { min: 0, max: 1000000 },
            states: ['All']
        },
        documents_required: ['Aadhaar Card', 'PAN Card', 'Business Plan', 'Address Proof', 'Bank Statements', 'Income Tax Returns'],
        benefits: 'Loans up to ₹10 lakhs: Shishu (up to ₹50,000), Kishore (₹50,000-₹5 lakhs), Tarun (₹5-₹10 lakhs)'
    },
    {
        name: 'National Scholarship Portal (NSP)',
        category: 'Education',
        description: 'Centralized platform for various scholarship schemes for students from different backgrounds.',
        eligibility_rules: {
            age: { min: 10, max: 35 },
            income: { min: 0, max: 800000 },
            states: ['All']
        },
        documents_required: ['Aadhaar Card', 'Income Certificate', 'Caste Certificate (if applicable)', 'Mark Sheets', 'Bank Account Details', 'Bonafide Certificate'],
        benefits: 'Financial assistance for education ranging from ₹10,000 to ₹1,00,000 per year depending on course and category'
    },
    {
        name: 'Stand Up India Scheme',
        category: 'Business',
        description: 'Facilitates bank loans between ₹10 lakh and ₹1 crore to SC/ST and women entrepreneurs.',
        eligibility_rules: {
            age: { min: 18, max: 65 },
            income: { min: 0, max: 1500000 },
            states: ['All']
        },
        documents_required: ['Aadhaar Card', 'PAN Card', 'Business Plan', 'Caste Certificate (for SC/ST)', 'Address Proof', 'Educational Certificates'],
        benefits: 'Bank loans from ₹10 lakh to ₹1 crore for greenfield enterprises in manufacturing, services, or trading sector'
    },
    {
        name: 'Atal Pension Yojana',
        category: 'Pension',
        description: 'Pension scheme for unorganized sector workers providing guaranteed pension after 60 years of age.',
        eligibility_rules: {
            age: { min: 18, max: 40 },
            income: { min: 0, max: 500000 },
            states: ['All']
        },
        documents_required: ['Aadhaar Card', 'Bank Account Details', 'Mobile Number'],
        benefits: 'Guaranteed pension of ₹1000 to ₹5000 per month after 60 years, based on contribution amount'
    }
];

const seedDatabase = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        // Clear existing schemes
        await Scheme.deleteMany({});
        console.log('🗑️  Cleared existing schemes');

        // Insert new schemes
        const insertedSchemes = await Scheme.insertMany(schemes);
        console.log(`✅ Inserted ${insertedSchemes.length} schemes`);

        console.log('\n📊 Seeded Schemes:');
        insertedSchemes.forEach((scheme, index) => {
            console.log(`   ${index + 1}. ${scheme.name} (${scheme.category})`);
        });

        console.log('\n✅ Database seeding completed successfully!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding database:', error);
        process.exit(1);
    }
};

seedDatabase();
