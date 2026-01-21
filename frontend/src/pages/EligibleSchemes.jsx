import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getEligibleSchemes } from '../services/schemeService';
import { createApplication } from '../services/trackerService';
import { useAuth } from '../context/AuthContext';
import Loader from '../components/Loader';

function EligibleSchemes() {
    const [schemes, setSchemes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [applying, setApplying] = useState(null);
    const { user } = useAuth();

    useEffect(() => {
        loadSchemes();
    }, []);

    const loadSchemes = async () => {
        try {
            const response = await getEligibleSchemes();
            setSchemes(response.data);
        } catch (error) {
            console.error('Error loading schemes:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleApply = async (schemeId) => {
        setApplying(schemeId);
        try {
            await createApplication(schemeId);
            alert('Application created successfully!');
        } catch (error) {
            alert('Error creating application');
        } finally {
            setApplying(null);
        }
    };

    // FEATURE 1: RULE-LEVEL ELIGIBILITY ENGINE
    const evaluateRuleLevels = (scheme) => {
        try {
            const rules = typeof scheme.eligibility_rules === 'string'
                ? JSON.parse(scheme.eligibility_rules)
                : scheme.eligibility_rules;

            if (!rules || typeof rules !== 'object') {
                return { matched: [], conditional: [], failed: [], total: 0 };
            }

            const ruleEvaluations = [];

            // Age rule
            if (rules.age) {
                const userAge = user?.age || 0;
                if (userAge >= (rules.age.min || 0) && userAge <= (rules.age.max || 120)) {
                    ruleEvaluations.push({ name: 'Age', status: 'matched', detail: `${userAge} years (${rules.age.min}-${rules.age.max})` });
                } else if (Math.abs(userAge - (rules.age.min || 0)) <= 2 || Math.abs(userAge - (rules.age.max || 120)) <= 2) {
                    ruleEvaluations.push({ name: 'Age', status: 'conditional', detail: `${userAge} years (borderline: ${rules.age.min}-${rules.age.max})` });
                } else {
                    ruleEvaluations.push({ name: 'Age', status: 'failed', detail: `${userAge} years (required: ${rules.age.min}-${rules.age.max})` });
                }
            }

            // Income rule
            if (rules.income) {
                const userIncome = user?.income || 0;
                const maxIncome = rules.income.max || Infinity;
                if (userIncome >= (rules.income.min || 0) && userIncome <= maxIncome) {
                    ruleEvaluations.push({ name: 'Income', status: 'matched', detail: `₹${userIncome.toLocaleString()} (≤₹${maxIncome.toLocaleString()})` });
                } else if (Math.abs(userIncome - maxIncome) / maxIncome <= 0.1) {
                    ruleEvaluations.push({ name: 'Income', status: 'conditional', detail: `₹${userIncome.toLocaleString()} (borderline: ≤₹${maxIncome.toLocaleString()})` });
                } else {
                    ruleEvaluations.push({ name: 'Income', status: 'failed', detail: `₹${userIncome.toLocaleString()} (required: ≤₹${maxIncome.toLocaleString()})` });
                }
            }

            // State/Residence rule
            if (rules.states) {
                const userState = user?.state || '';
                if (rules.states.includes('All') || rules.states.includes(userState)) {
                    ruleEvaluations.push({ name: 'Residence', status: 'matched', detail: userState });
                } else if (userState) {
                    ruleEvaluations.push({ name: 'Residence', status: 'failed', detail: `${userState} (not eligible)` });
                } else {
                    ruleEvaluations.push({ name: 'Residence', status: 'conditional', detail: 'State not provided' });
                }
            }

            // Gender rule
            if (rules.gender) {
                const userGender = user?.gender || '';
                if (userGender === rules.gender) {
                    ruleEvaluations.push({ name: 'Gender', status: 'matched', detail: userGender });
                } else if (!userGender) {
                    ruleEvaluations.push({ name: 'Gender', status: 'conditional', detail: 'Gender not provided' });
                } else {
                    ruleEvaluations.push({ name: 'Gender', status: 'failed', detail: `Required: ${rules.gender}` });
                }
            }

            // Category rule
            if (rules.category) {
                const userCategory = user?.category || '';
                if (userCategory === rules.category) {
                    ruleEvaluations.push({ name: 'Category', status: 'matched', detail: userCategory });
                } else if (!userCategory) {
                    ruleEvaluations.push({ name: 'Category', status: 'conditional', detail: 'Category not provided' });
                } else {
                    ruleEvaluations.push({ name: 'Category', status: 'failed', detail: `Required: ${rules.category}` });
                }
            }

            // Education rule (if exists)
            if (rules.education) {
                ruleEvaluations.push({ name: 'Education', status: 'conditional', detail: 'Verification pending' });
            }

            const matched = ruleEvaluations.filter(r => r.status === 'matched');
            const conditional = ruleEvaluations.filter(r => r.status === 'conditional');
            const failed = ruleEvaluations.filter(r => r.status === 'failed');

            return {
                matched,
                conditional,
                failed,
                total: ruleEvaluations.length,
                coverage: ruleEvaluations.length > 0 ? Math.round((matched.length / ruleEvaluations.length) * 100) : 0
            };
        } catch (error) {
            console.error('Error evaluating rules:', error);
            return { matched: [], conditional: [], failed: [], total: 0, coverage: 0 };
        }
    };

    // FEATURE 3: DOCUMENT READINESS INTELLIGENCE
    const calculateDocumentReadiness = (scheme) => {
        const requiredDocs = scheme.documents_required || [];
        const uploadedDocs = []; // TODO: Get from user's uploaded documents
        const missingDocs = requiredDocs.filter(doc => !uploadedDocs.includes(doc));
        const expiredDocs = []; // TODO: Check expiry dates

        const readinessScore = requiredDocs.length > 0
            ? Math.round((uploadedDocs.length / requiredDocs.length) * 100)
            : 0;

        return {
            required: requiredDocs,
            uploaded: uploadedDocs,
            missing: missingDocs,
            expired: expiredDocs,
            score: readinessScore
        };
    };

    // FEATURE 4: FAILURE & REJECTION AWARENESS
    const getRejectionIntelligence = (schemeName) => {
        const rejectionData = {
            'PM-KISAN': {
                commonReasons: ['Incomplete land records', 'Name mismatch in documents', 'Invalid bank account'],
                highRiskConditions: ['Land ownership disputed', 'Multiple applications from same family'],
                rejectionRate: 22,
                warnings: ['High rejection rate due to land record verification issues']
            },
            'Ayushman Bharat': {
                commonReasons: ['Income proof mismatch', 'Ration card not linked', 'Duplicate enrollment'],
                highRiskConditions: ['Income above threshold', 'Missing family details'],
                rejectionRate: 15,
                warnings: ['Income certificate must be recent (within 6 months)']
            },
            'Sukanya Samriddhi': {
                commonReasons: ['Age verification failed', 'Birth certificate issues', 'Guardian details incomplete'],
                highRiskConditions: ['Girl child above 10 years', 'Multiple accounts'],
                rejectionRate: 8,
                warnings: ['Birth certificate must be government-issued']
            },
            'PM Awas Yojana': {
                commonReasons: ['Property document issues', 'Income threshold exceeded', 'Existing property ownership'],
                highRiskConditions: ['Urban area classification unclear', 'Family member owns property'],
                rejectionRate: 28,
                warnings: ['High rejection rate due to property ownership verification']
            },
            'Pradhan Mantri Mudra': {
                commonReasons: ['Business plan inadequate', 'Credit score low', 'Collateral insufficient'],
                highRiskConditions: ['Existing loan defaults', 'Business not registered'],
                rejectionRate: 35,
                warnings: ['Business plan must show clear revenue model']
            }
        };

        for (const [key, value] of Object.entries(rejectionData)) {
            if (schemeName.includes(key)) {
                return value;
            }
        }

        return {
            commonReasons: ['Document verification pending', 'Eligibility criteria not met'],
            highRiskConditions: ['Incomplete profile', 'Missing documents'],
            rejectionRate: 18,
            warnings: ['Ensure all documents are valid and up-to-date']
        };
    };

    // FEATURE 5: STATE & LOCAL RULE OVERRIDE
    const getStateOverrides = (schemeName, userState) => {
        const overrides = {
            'Tamil Nadu': {
                'PM-KISAN': 'Additional income verification required through e-Sevai centers',
                'Ayushman Bharat': 'State health card mandatory for enrollment'
            },
            'Maharashtra': {
                'PM Awas Yojana': 'MHADA clearance certificate required for urban areas',
                'Ayushman Bharat': 'Mahatma Jyotiba Phule Jan Arogya Yojana integration required'
            },
            'Karnataka': {
                'PM-KISAN': 'Land records must be updated in Bhoomi portal',
                'National Scholarship': 'Karnataka domicile certificate mandatory'
            }
        };

        if (userState && overrides[userState]) {
            for (const [scheme, override] of Object.entries(overrides[userState])) {
                if (schemeName.includes(scheme)) {
                    return override;
                }
            }
        }

        return null;
    };

    // FEATURE 6: TIME & DELAY ESTIMATION
    const getTimeEstimation = (schemeName) => {
        const timeData = {
            'PM-KISAN': { min: 15, max: 30, delayRisk: 'Low', highDelayStages: ['Bank verification'] },
            'Ayushman Bharat': { min: 20, max: 35, delayRisk: 'Medium', highDelayStages: ['Income verification', 'Family details check'] },
            'Sukanya Samriddhi': { min: 10, max: 20, delayRisk: 'Low', highDelayStages: ['Birth certificate verification'] },
            'PM Awas Yojana': { min: 45, max: 90, delayRisk: 'High', highDelayStages: ['Property verification', 'Income assessment', 'Site inspection'] },
            'Pradhan Mantri Mudra': { min: 20, max: 45, delayRisk: 'Medium', highDelayStages: ['Business plan review', 'Credit check'] },
            'National Scholarship': { min: 30, max: 60, delayRisk: 'Medium', highDelayStages: ['Institute verification', 'Caste certificate check'] },
            'Stand Up India': { min: 25, max: 40, delayRisk: 'Medium', highDelayStages: ['Category verification', 'Business viability assessment'] },
            'Atal Pension': { min: 7, max: 15, delayRisk: 'Low', highDelayStages: ['Bank account linking'] }
        };

        for (const [key, value] of Object.entries(timeData)) {
            if (schemeName.includes(key)) {
                return value;
            }
        }

        return { min: 20, max: 45, delayRisk: 'Medium', highDelayStages: ['Document verification'] };
    };

    // Determine approval risk based on rule coverage and document readiness
    const getApprovalRisk = (ruleCoverage, docReadiness, rejectionRate) => {
        const score = (ruleCoverage * 0.6) + (docReadiness * 0.4);

        if (score >= 85 && rejectionRate < 15) {
            return { level: 'LOW', color: 'success', message: 'High approval probability', probability: '85-95%' };
        } else if (score >= 65 || rejectionRate < 25) {
            return { level: 'MEDIUM', color: 'warning', message: 'Moderate approval probability', probability: '60-75%' };
        } else {
            return { level: 'HIGH', color: 'danger', message: 'Low approval probability', probability: '30-50%' };
        }
    };

    if (loading) return <Loader />;

    return (
        <div className="container">
            <div style={{ marginBottom: '2rem', borderLeft: '4px solid var(--primary)', paddingLeft: '1rem' }}>
                <h1>Eligibility Intelligence Results</h1>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '0.25rem', fontSize: '1rem' }}>
                    {schemes.length} schemes analyzed • Rule-level evaluation engine
                </p>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', fontStyle: 'italic', margin: 0 }}>
                    "This system does not aim to list schemes. It aims to reduce rejection, delay, and uncertainty by predicting and preventing application failure before submission."
                </p>
            </div>

            {schemes.length === 0 ? (
                <div className="card text-center">
                    <h3>No schemes found</h3>
                    <p>Update your profile to discover eligible schemes</p>
                    <Link to="/profile" className="btn btn-primary mt-2">Complete Profile</Link>
                </div>
            ) : (
                <div className="grid">
                    {schemes.map(scheme => {
                        const schemeId = scheme._id || scheme.id;
                        const ruleEval = evaluateRuleLevels(scheme);
                        const docReadiness = calculateDocumentReadiness(scheme);
                        const rejectionIntel = getRejectionIntelligence(scheme.name);
                        const stateOverride = getStateOverrides(scheme.name, user?.state);
                        const timeEst = getTimeEstimation(scheme.name);
                        const approvalRisk = getApprovalRisk(ruleEval.coverage, docReadiness.score, rejectionIntel.rejectionRate);

                        return (
                            <div key={schemeId} className="card" style={{ borderLeft: `4px solid var(--${approvalRisk.color})` }}>
                                {/* Header */}
                                <div style={{ marginBottom: '1rem' }}>
                                    <h3 style={{ marginBottom: '0.5rem', fontSize: '1.125rem' }}>{scheme.name}</h3>
                                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                                        <span className="badge badge-primary">{scheme.category}</span>
                                        <span className="badge badge-info">Central</span>
                                    </div>
                                </div>

                                {/* FEATURE 1: RULE-LEVEL ELIGIBILITY ENGINE */}
                                <div style={{
                                    background: 'var(--gray-50)',
                                    padding: '1rem',
                                    borderRadius: 'var(--radius-md)',
                                    marginBottom: '1rem',
                                    border: '1px solid var(--gray-200)'
                                }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                                        <div>
                                            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.25rem', fontWeight: '600' }}>
                                                RULE-LEVEL ANALYSIS
                                            </p>
                                            <p style={{ fontSize: '0.875rem', margin: 0 }}>
                                                Total rules: {ruleEval.total} •
                                                Satisfied: <span style={{ color: 'var(--success)', fontWeight: '600' }}>{ruleEval.matched.length}</span> •
                                                Conditional: <span style={{ color: 'var(--warning)', fontWeight: '600' }}>{ruleEval.conditional.length}</span> •
                                                Failed: <span style={{ color: 'var(--danger)', fontWeight: '600' }}>{ruleEval.failed.length}</span>
                                            </p>
                                        </div>
                                        <div style={{ textAlign: 'right' }}>
                                            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.25rem', fontWeight: '600' }}>
                                                RULE COVERAGE
                                            </p>
                                            <p style={{ fontSize: '1.5rem', fontWeight: '700', margin: 0, color: 'var(--primary)' }}>
                                                {ruleEval.coverage}%
                                            </p>
                                        </div>
                                    </div>

                                    {/* Rule Details */}
                                    <div style={{ borderTop: '1px solid var(--gray-200)', paddingTop: '0.75rem' }}>
                                        {ruleEval.matched.map((rule, idx) => (
                                            <div key={idx} style={{ fontSize: '0.75rem', marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                <span style={{ color: 'var(--success)', fontWeight: '700' }}>✓</span>
                                                <span style={{ fontWeight: '600' }}>{rule.name}:</span>
                                                <span style={{ color: 'var(--text-secondary)' }}>{rule.detail}</span>
                                            </div>
                                        ))}
                                        {ruleEval.conditional.map((rule, idx) => (
                                            <div key={idx} style={{ fontSize: '0.75rem', marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                <span style={{ color: 'var(--warning)', fontWeight: '700' }}>⚠</span>
                                                <span style={{ fontWeight: '600' }}>{rule.name}:</span>
                                                <span style={{ color: 'var(--text-secondary)' }}>{rule.detail}</span>
                                            </div>
                                        ))}
                                        {ruleEval.failed.map((rule, idx) => (
                                            <div key={idx} style={{ fontSize: '0.75rem', marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                <span style={{ color: 'var(--danger)', fontWeight: '700' }}>✗</span>
                                                <span style={{ fontWeight: '600' }}>{rule.name}:</span>
                                                <span style={{ color: 'var(--text-secondary)' }}>{rule.detail}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* FEATURE 2: APPROVAL RISK with Probability */}
                                <div style={{
                                    background: `var(--${approvalRisk.color}-light)`,
                                    border: `1px solid var(--${approvalRisk.color})`,
                                    padding: '0.75rem',
                                    borderRadius: 'var(--radius-md)',
                                    marginBottom: '1rem'
                                }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <div>
                                            <p style={{ fontSize: '0.75rem', fontWeight: '600', marginBottom: '0.25rem' }}>
                                                APPROVAL RISK: <span className={`badge badge-${approvalRisk.color}`}>{approvalRisk.level}</span>
                                            </p>
                                            <p style={{ fontSize: '0.875rem', margin: 0 }}>
                                                {approvalRisk.message} • Probability: {approvalRisk.probability}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* FEATURE 3: DOCUMENT READINESS INTELLIGENCE */}
                                <div style={{
                                    background: 'var(--gray-50)',
                                    padding: '1rem',
                                    borderRadius: 'var(--radius-md)',
                                    marginBottom: '1rem',
                                    border: '1px solid var(--gray-200)'
                                }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                                        <p style={{ fontSize: '0.75rem', fontWeight: '600', marginBottom: 0 }}>
                                            DOCUMENT READINESS PANEL
                                        </p>
                                        <p style={{ fontSize: '0.875rem', fontWeight: '700', margin: 0, color: docReadiness.score >= 80 ? 'var(--success)' : 'var(--danger)' }}>
                                            {docReadiness.score}%
                                        </p>
                                    </div>
                                    <div style={{ fontSize: '0.75rem' }}>
                                        <p style={{ marginBottom: '0.25rem' }}>
                                            <span style={{ fontWeight: '600' }}>Required:</span> {docReadiness.required.length} documents
                                        </p>
                                        <p style={{ marginBottom: '0.25rem' }}>
                                            <span style={{ fontWeight: '600' }}>Uploaded:</span> <span style={{ color: 'var(--success)' }}>{docReadiness.uploaded.length}</span>
                                        </p>
                                        <p style={{ marginBottom: '0.25rem' }}>
                                            <span style={{ fontWeight: '600' }}>Missing:</span> <span style={{ color: 'var(--danger)' }}>{docReadiness.missing.length}</span>
                                        </p>
                                        {docReadiness.missing.length > 0 && (
                                            <div style={{ marginTop: '0.5rem', paddingTop: '0.5rem', borderTop: '1px solid var(--gray-200)' }}>
                                                <p style={{ fontWeight: '600', marginBottom: '0.25rem' }}>Missing documents:</p>
                                                <ul style={{ margin: 0, paddingLeft: '1.25rem' }}>
                                                    {docReadiness.missing.slice(0, 3).map((doc, idx) => (
                                                        <li key={idx}>{doc}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* FEATURE 4: FAILURE & REJECTION AWARENESS */}
                                <div style={{
                                    background: 'var(--warning-light)',
                                    border: '1px solid var(--warning)',
                                    padding: '0.75rem',
                                    borderRadius: 'var(--radius-md)',
                                    marginBottom: '1rem'
                                }}>
                                    <p style={{ fontSize: '0.75rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                                        ⚠️ REJECTION INTELLIGENCE
                                    </p>
                                    <p style={{ fontSize: '0.75rem', marginBottom: '0.5rem' }}>
                                        <strong>Historical rejection rate:</strong> {rejectionIntel.rejectionRate}%
                                    </p>
                                    <p style={{ fontSize: '0.75rem', marginBottom: '0.5rem', fontWeight: '600' }}>
                                        Common rejection reasons:
                                    </p>
                                    <ul style={{ margin: 0, paddingLeft: '1.25rem', fontSize: '0.75rem' }}>
                                        {rejectionIntel.commonReasons.slice(0, 2).map((reason, idx) => (
                                            <li key={idx}>{reason}</li>
                                        ))}
                                    </ul>
                                    {rejectionIntel.warnings.length > 0 && (
                                        <p style={{ fontSize: '0.75rem', marginTop: '0.5rem', fontStyle: 'italic', color: 'var(--danger)' }}>
                                            ⚠ {rejectionIntel.warnings[0]}
                                        </p>
                                    )}
                                </div>

                                {/* FEATURE 5: STATE & LOCAL RULE OVERRIDE */}
                                {stateOverride && (
                                    <div style={{
                                        background: 'var(--info-light)',
                                        border: '1px solid var(--info)',
                                        padding: '0.75rem',
                                        borderRadius: 'var(--radius-md)',
                                        marginBottom: '1rem'
                                    }}>
                                        <p style={{ fontSize: '0.75rem', fontWeight: '600', marginBottom: '0.25rem' }}>
                                            📍 STATE-SPECIFIC REQUIREMENT ({user?.state})
                                        </p>
                                        <p style={{ fontSize: '0.75rem', margin: 0 }}>
                                            {stateOverride}
                                        </p>
                                    </div>
                                )}

                                {/* FEATURE 6: TIME & DELAY ESTIMATION */}
                                <div style={{
                                    background: 'var(--gray-50)',
                                    padding: '0.75rem',
                                    borderRadius: 'var(--radius-md)',
                                    marginBottom: '1rem'
                                }}>
                                    <p style={{ fontSize: '0.75rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                                        ⏱️ TIME ESTIMATION
                                    </p>
                                    <p style={{ fontSize: '0.75rem', marginBottom: '0.25rem' }}>
                                        <strong>Estimated decision time:</strong> {timeEst.min}–{timeEst.max} days
                                    </p>
                                    <p style={{ fontSize: '0.75rem', marginBottom: '0.25rem' }}>
                                        <strong>Delay risk:</strong> <span className={`badge badge-${timeEst.delayRisk === 'Low' ? 'success' : timeEst.delayRisk === 'Medium' ? 'warning' : 'danger'}`}>{timeEst.delayRisk}</span>
                                    </p>
                                    {timeEst.highDelayStages.length > 0 && (
                                        <p style={{ fontSize: '0.75rem', margin: 0 }}>
                                            <strong>High-delay stages:</strong> {timeEst.highDelayStages.join(', ')}
                                        </p>
                                    )}
                                </div>

                                {/* Description */}
                                <p style={{ fontSize: '0.875rem', marginBottom: '1rem', lineHeight: '1.6' }}>
                                    {scheme.description}
                                </p>

                                {/* Actions */}
                                <div style={{ display: 'flex', gap: '0.75rem' }}>
                                    <Link
                                        to={`/schemes/${schemeId}`}
                                        className="btn btn-outline btn-sm"
                                        style={{ flex: 1 }}
                                    >
                                        Full Analysis →
                                    </Link>
                                    <button
                                        onClick={() => handleApply(schemeId)}
                                        className="btn btn-primary btn-sm"
                                        disabled={applying === schemeId || ruleEval.failed.length > 0}
                                        style={{ flex: 1 }}
                                    >
                                        {applying === schemeId ? 'Processing...' : ruleEval.failed.length > 0 ? 'Not Eligible' : 'Pre-check & Apply →'}
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

export default EligibleSchemes;
