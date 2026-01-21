import { useEffect, useState } from 'react';
import { getUserApplications } from '../services/trackerService';
import { APPLICATION_STATUS } from '../utils/constants';
import Loader from '../components/Loader';

function ApplicationTracker() {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadApplications();
    }, []);

    const loadApplications = async () => {
        try {
            const response = await getUserApplications();
            setApplications(response.data);
        } catch (error) {
            console.error('Error loading applications:', error);
        } finally {
            setLoading(false);
        }
    };

    // Enhanced application data with failure-handling logic
    const enhanceApplicationData = (app) => {
        const statusEnhancements = {
            'submitted': {
                delayReason: 'Awaiting initial verification',
                missingDocs: ['Income Certificate', 'Address Proof'],
                appealEligible: false,
                verificationStage: 'Document Upload',
                nextAction: 'Upload pending documents'
            },
            'under_review': {
                delayReason: 'Income verification in progress',
                missingDocs: [],
                appealEligible: false,
                verificationStage: 'Rule Verification',
                nextAction: 'Awaiting dept. approval'
            },
            'approved': {
                delayReason: null,
                missingDocs: [],
                appealEligible: false,
                verificationStage: 'Completed',
                nextAction: 'Benefit disbursement initiated'
            },
            'rejected': {
                delayReason: 'Income threshold exceeded',
                missingDocs: [],
                appealEligible: true,
                verificationStage: 'Decision',
                nextAction: 'Appeal within 30 days'
            }
        };

        return statusEnhancements[app.status] || {
            delayReason: 'Processing',
            missingDocs: [],
            appealEligible: false,
            verificationStage: 'Pending',
            nextAction: 'Check back later'
        };
    };

    // Application flow stages
    const getFlowStages = (currentStatus) => {
        const stages = [
            { name: 'Pre-check', status: 'completed' },
            { name: 'Document Readiness', status: currentStatus === 'submitted' ? 'active' : 'completed' },
            { name: 'Submit', status: ['submitted', 'under_review', 'approved', 'rejected'].includes(currentStatus) ? 'completed' : 'pending' },
            { name: 'Verification', status: currentStatus === 'under_review' ? 'active' : (currentStatus === 'submitted' ? 'pending' : 'completed') },
            { name: 'Decision', status: ['approved', 'rejected'].includes(currentStatus) ? 'completed' : 'pending' }
        ];
        return stages;
    };

    if (loading) return <Loader />;

    return (
        <div className="container">
            <div style={{ marginBottom: '2rem', borderLeft: '4px solid var(--primary)', paddingLeft: '1rem' }}>
                <h1>Application Pipeline</h1>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '0' }}>
                    Track verification status, delay reasons, and appeal eligibility
                </p>
            </div>

            {applications.length === 0 ? (
                <div className="card text-center">
                    <h3>No applications in pipeline</h3>
                    <p>Start by applying to eligible schemes</p>
                </div>
            ) : (
                <div className="grid">
                    {applications.map(app => {
                        const enhancement = enhanceApplicationData(app);
                        const flowStages = getFlowStages(app.status);
                        const statusInfo = APPLICATION_STATUS[app.status] || { label: app.status, color: 'info' };

                        return (
                            <div key={app.id} className="card" style={{ borderLeft: `4px solid var(--${statusInfo.color})` }}>
                                {/* Header */}
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                                    <div style={{ flex: 1 }}>
                                        <h3 style={{ marginBottom: '0.5rem', fontSize: '1.125rem' }}>{app.scheme_name}</h3>
                                        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                                            <span className="badge badge-primary">{app.category}</span>
                                            <span className={`badge badge-${statusInfo.color}`}>
                                                {statusInfo.label}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Application Flow Stepper */}
                                <div style={{
                                    background: 'var(--gray-50)',
                                    padding: '1rem',
                                    borderRadius: 'var(--radius-md)',
                                    marginBottom: '1rem'
                                }}>
                                    <p style={{ fontSize: '0.75rem', fontWeight: '600', marginBottom: '0.75rem', color: 'var(--text-secondary)' }}>
                                        VERIFICATION FLOW:
                                    </p>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative' }}>
                                        {flowStages.map((stage, idx) => (
                                            <div key={idx} style={{
                                                flex: 1,
                                                textAlign: 'center',
                                                position: 'relative',
                                                zIndex: 1
                                            }}>
                                                <div style={{
                                                    width: '32px',
                                                    height: '32px',
                                                    borderRadius: '50%',
                                                    background: stage.status === 'completed' ? 'var(--success)' :
                                                        stage.status === 'active' ? 'var(--primary)' : 'var(--gray-300)',
                                                    color: 'white',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    margin: '0 auto 0.5rem',
                                                    fontSize: '0.75rem',
                                                    fontWeight: '700'
                                                }}>
                                                    {stage.status === 'completed' ? '✓' : idx + 1}
                                                </div>
                                                <p style={{
                                                    fontSize: '0.65rem',
                                                    margin: 0,
                                                    color: stage.status === 'active' ? 'var(--primary)' : 'var(--text-secondary)',
                                                    fontWeight: stage.status === 'active' ? '600' : '400'
                                                }}>
                                                    {stage.name}
                                                </p>
                                            </div>
                                        ))}
                                        {/* Connecting line */}
                                        <div style={{
                                            position: 'absolute',
                                            top: '16px',
                                            left: '10%',
                                            right: '10%',
                                            height: '2px',
                                            background: 'var(--gray-300)',
                                            zIndex: 0
                                        }} />
                                    </div>
                                </div>

                                {/* Application Details */}
                                <div style={{
                                    display: 'grid',
                                    gridTemplateColumns: '1fr 1fr',
                                    gap: '0.75rem',
                                    marginBottom: '1rem',
                                    fontSize: '0.875rem'
                                }}>
                                    <div>
                                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', marginBottom: '0.25rem' }}>
                                            APPLIED DATE
                                        </p>
                                        <p style={{ margin: 0, fontWeight: '500' }}>
                                            {new Date(app.applied_date).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <div>
                                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', marginBottom: '0.25rem' }}>
                                            RISK SCORE
                                        </p>
                                        <p style={{ margin: 0, fontWeight: '500' }}>
                                            {app.risk_score || 0}/100
                                        </p>
                                    </div>
                                </div>

                                {/* Failure-Handling Logic */}
                                {enhancement.delayReason && (
                                    <div style={{
                                        background: app.status === 'rejected' ? 'var(--danger-light)' : 'var(--warning-light)',
                                        padding: '0.75rem',
                                        borderRadius: 'var(--radius-md)',
                                        marginBottom: '1rem',
                                        border: `1px solid ${app.status === 'rejected' ? 'var(--danger)' : 'var(--warning)'}`
                                    }}>
                                        <p style={{ fontSize: '0.75rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                                            {app.status === 'rejected' ? '⚠️ REJECTION REASON:' : '⏱️ DELAY REASON:'}
                                        </p>
                                        <p style={{ fontSize: '0.875rem', margin: 0 }}>
                                            {enhancement.delayReason}
                                        </p>
                                    </div>
                                )}

                                {/* Missing Documents Flag */}
                                {enhancement.missingDocs.length > 0 && (
                                    <div style={{
                                        background: 'var(--danger-light)',
                                        padding: '0.75rem',
                                        borderRadius: 'var(--radius-md)',
                                        marginBottom: '1rem',
                                        border: '1px solid var(--danger)'
                                    }}>
                                        <p style={{ fontSize: '0.75rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                                            📄 MISSING DOCUMENTS:
                                        </p>
                                        <ul style={{ margin: 0, paddingLeft: '1.25rem', fontSize: '0.875rem' }}>
                                            {enhancement.missingDocs.map((doc, idx) => (
                                                <li key={idx}>{doc}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {/* Appeal Eligibility Indicator */}
                                {enhancement.appealEligible && (
                                    <div style={{
                                        background: 'var(--info-light)',
                                        padding: '0.75rem',
                                        borderRadius: 'var(--radius-md)',
                                        marginBottom: '1rem',
                                        border: '1px solid var(--info)'
                                    }}>
                                        <p style={{ fontSize: '0.75rem', fontWeight: '600', marginBottom: '0.25rem' }}>
                                            ⚖️ APPEAL ELIGIBLE
                                        </p>
                                        <p style={{ fontSize: '0.875rem', margin: 0 }}>
                                            You can appeal this decision within 30 days with additional documentation
                                        </p>
                                    </div>
                                )}

                                {/* Next Action */}
                                <div style={{
                                    padding: '0.75rem',
                                    background: 'var(--gray-50)',
                                    borderRadius: 'var(--radius-md)'
                                }}>
                                    <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>
                                        NEXT ACTION:
                                    </p>
                                    <p style={{ fontSize: '0.875rem', fontWeight: '500', margin: 0 }}>
                                        {enhancement.nextAction}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

export default ApplicationTracker;
