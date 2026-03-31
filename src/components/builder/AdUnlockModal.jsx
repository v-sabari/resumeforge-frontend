import { useState } from 'react';
import { completeAd, failAd, startAd } from '../../services/adService';
import { Modal } from '../common/Modal';
import { Alert } from '../common/Alert';
import { Loader } from '../common/Loader';
import { formatApiError } from '../../utils/helpers';

export const AdUnlockModal = ({ isOpen, onClose, resumeId, onUnlocked }) => {
  const [stage, setStage] = useState('idle');
  const [message, setMessage] = useState('Watch a short ad to unlock your first free export. Premium users skip this step entirely.');
  const [adSession, setAdSession] = useState(null);

  const handleStart = async () => {
    setStage('loading');
    try {
      const response = await startAd({ resumeId });
      setAdSession(response?.adSessionId || response?.sessionId || response?.data?.adSessionId || response?.data?.sessionId || null);
      setStage('watching');
      setMessage('Ad session started. Simulate completion below to unlock export access.');
    } catch (error) {
      setStage('error');
      setMessage(formatApiError(error, 'Could not start ad session.'));
    }
  };

  const handleComplete = async () => {
    setStage('loading');
    try {
      const payload = adSession ? { adSessionId: adSession, resumeId } : { resumeId };
      await completeAd(payload);
      setStage('success');
      setMessage('Ad completed successfully. Your free export is unlocked.');
      onUnlocked?.();
    } catch (error) {
      setStage('error');
      setMessage(formatApiError(error, 'Ad completion could not be verified.'));
    }
  };

  const handleFail = async () => {
    setStage('loading');
    try {
      const payload = adSession ? { adSessionId: adSession, resumeId } : { resumeId };
      await failAd(payload);
      setStage('failed');
      setMessage('The ad was skipped or failed. Export remains locked until successful completion.');
    } catch (error) {
      setStage('error');
      setMessage(formatApiError(error, 'Could not register ad failure.'));
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Watch Ad to Unlock Free Export">
      <div className="space-y-4">
        <Alert variant={stage === 'success' ? 'success' : stage === 'error' || stage === 'failed' ? 'error' : 'info'}>
          {message}
        </Alert>
        <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-5 text-sm leading-7 text-slate-600">
          Rewarded ads are backend-verified. Users who skip or fail the ad stay locked from exporting until completion succeeds.
        </div>
        {stage === 'loading' ? <Loader label="Updating ad state..." /> : null}
        <div className="flex flex-wrap gap-3">
          {stage === 'idle' ? (
            <button type="button" className="btn-primary" onClick={handleStart}>
              Start ad
            </button>
          ) : null}
          {stage === 'watching' ? (
            <>
              <button type="button" className="btn-primary" onClick={handleComplete}>
                Mark ad complete
              </button>
              <button type="button" className="btn-secondary" onClick={handleFail}>
                Skip / fail ad
              </button>
            </>
          ) : null}
          <button type="button" className="btn-secondary" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
};
