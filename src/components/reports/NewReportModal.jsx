import React, { useState } from 'react';
import { useDisasterData } from '../../context/DisasterDataContext';
import { X, Upload } from 'lucide-react';

export default function NewReportModal({ isOpen, onClose }) {
  const { addFieldReport } = useDisasterData();

  const [reporterName, setReporterName] = useState('');
  const [reporterRole, setReporterRole] = useState('SDRF Ground Patrol');
  const [location, setLocation] = useState('');
  const [district, setDistrict] = useState('Dima Hasao');
  const [state, setState] = useState('Assam');
  const [incidentType, setIncidentType] = useState('Massive Mudslide & Road Breach');
  const [severity, setSeverity] = useState('critical');
  const [description, setDescription] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [photoPreview, setPhotoPreview] = useState(null);

  if (!isOpen) return null;

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setPhotoPreview(previewUrl);
      setPhotoUrl(previewUrl);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const finalPhoto =
      photoUrl ||
      'https://images.unsplash.com/photo-1547683905-f686c993aae5?auto=format&fit=crop&w=600&q=80';

    addFieldReport({
      reporterName: reporterName || 'Field Patrol Unit',
      reporterRole,
      location: location || `${district} Sector Landmark`,
      district,
      state,
      lat: 25.15 + (Math.random() * 0.4 - 0.2),
      lng: 93.02 + (Math.random() * 0.4 - 0.2),
      incidentType,
      severity,
      priority: severity,
      description: description || 'Visual report logged by field patrol unit.',
      photoUrl: finalPhoto,
      sopAction: `Recommended: dispatch local inspection unit per ${incidentType} SOP`,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/30 backdrop-blur-xs">
      <div className="relative w-full max-w-lg rounded-lg bg-white border border-stone-200 shadow-lg p-6 overflow-y-auto max-h-[90vh] text-stone-800">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-stone-100 mb-4">
          <div>
            <h3 className="text-base font-semibold text-stone-900">
              Submit Field Incident Report
            </h3>
            <span className="text-xs text-stone-500 mt-0.5 block">
              Sections 28–31 Ground Patrol & Eyewitness Ingestion
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          
          {/* Reporter info */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-stone-600 font-medium block mb-1">
                Reporter Name / Call-sign
              </label>
              <input
                type="text"
                placeholder="e.g. Inspector Borah"
                value={reporterName}
                onChange={(e) => setReporterName(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded bg-stone-50 border border-stone-200 text-stone-900 focus:bg-white focus:outline-none focus:border-stone-400"
                required
              />
            </div>

            <div>
              <label className="text-stone-600 font-medium block mb-1">
                Affiliation
              </label>
              <select
                value={reporterRole}
                onChange={(e) => setReporterRole(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded bg-stone-50 border border-stone-200 text-stone-900 focus:bg-white focus:outline-none focus:border-stone-400"
              >
                <option value="SDRF Ground Patrol">SDRF Ground Patrol</option>
                <option value="BRO Engineering Team">BRO Project Team</option>
                <option value="Local Village Authority">Gram Panchayat Authority</option>
                <option value="PWD Roads Inspector">PWD Roads Inspector</option>
                <option value="Verified Citizen / Volunteer">Citizen Volunteer</option>
              </select>
            </div>
          </div>

          {/* Location & District */}
          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-2">
              <label className="text-stone-600 font-medium block mb-1">
                Specific Location / Km Marker
              </label>
              <input
                type="text"
                placeholder="e.g. NH-27 Km 84 Jatinga Incline"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded bg-stone-50 border border-stone-200 text-stone-900 focus:bg-white focus:outline-none focus:border-stone-400"
                required
              />
            </div>

            <div>
              <label className="text-stone-600 font-medium block mb-1">
                District (NER)
              </label>
              <select
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded bg-stone-50 border border-stone-200 text-stone-900 focus:bg-white focus:outline-none focus:border-stone-400"
              >
                <option value="Dima Hasao">Dima Hasao (AS)</option>
                <option value="Mangan">Mangan (SK)</option>
                <option value="East Khasi Hills">East Khasi Hills (ML)</option>
                <option value="Noney">Noney (MN)</option>
                <option value="Kohima">Kohima (NL)</option>
                <option value="Aizawl">Aizawl (MZ)</option>
                <option value="West Kameng">West Kameng (AR)</option>
              </select>
            </div>
          </div>

          {/* Incident Type & Severity */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-stone-600 font-medium block mb-1">
                Incident Classification
              </label>
              <select
                value={incidentType}
                onChange={(e) => setIncidentType(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded bg-stone-50 border border-stone-200 text-stone-900 focus:bg-white focus:outline-none focus:border-stone-400"
              >
                <option value="Massive Mudslide & Road Breach">Massive Mudslide & Road Breach</option>
                <option value="Rockfall & Boulder Avalanche">Rockfall & Boulder Avalanche</option>
                <option value="Pavement Subsidence & Tensile Cracks">Pavement Subsidence & Cracks</option>
                <option value="Culvert Overflow & Scouring">Culvert Overflow & Scouring</option>
                <option value="Toe Erosion & Retaining Wall Failure">Toe Erosion / Retaining Wall</option>
              </select>
            </div>

            <div>
              <label className="text-stone-600 font-medium block mb-1">
                Observed Severity
              </label>
              <select
                value={severity}
                onChange={(e) => setSeverity(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded bg-stone-50 border border-stone-200 text-stone-900 focus:bg-white focus:outline-none focus:border-stone-400 font-medium"
              >
                <option value="critical">Critical (Total Blockage / Life Hazard)</option>
                <option value="high">High (Partial Block / Single Lane)</option>
                <option value="moderate">Moderate (Passable with caution)</option>
                <option value="low">Low (Monitoring Alert)</option>
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="text-stone-600 font-medium block mb-1">
              Field Observations
            </label>
            <textarea
              rows={3}
              placeholder="Describe scale of slide, approximate length of obstruction, stranded vehicles, and status of power/comms lines..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-2.5 py-1.5 rounded bg-stone-50 border border-stone-200 text-stone-900 focus:bg-white focus:outline-none focus:border-stone-400"
              required
            />
          </div>

          {/* Photo Upload */}
          <div>
            <label className="text-stone-600 font-medium block mb-1">
              Photograph Attachment
            </label>
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-stone-50 hover:bg-stone-100 border border-stone-200 text-stone-700 cursor-pointer transition-colors">
                <Upload className="w-3.5 h-3.5 text-stone-500" />
                <span>Choose Image</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  className="hidden"
                />
              </label>
              <span className="text-[11px] text-stone-400">
                {photoPreview ? 'Photo attached' : 'Default photo used if empty'}
              </span>
            </div>

            {photoPreview && (
              <div className="mt-2 relative w-28 h-18 rounded overflow-hidden border border-stone-200">
                <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => setPhotoPreview(null)}
                  className="absolute top-1 right-1 p-0.5 rounded-full bg-stone-900/70 text-white"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            )}
          </div>

          {/* Notice */}
          <div className="p-2.5 rounded bg-stone-50 border border-stone-200 text-stone-600 text-[11px] leading-relaxed">
            Report will initially be flagged as <strong>Predicted (unverified)</strong> until confirmed on-site by the district response team.
          </div>

          {/* Submit Actions */}
          <div className="pt-2 border-t border-stone-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 rounded bg-white hover:bg-stone-100 border border-stone-200 text-stone-700 font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-3.5 py-1.5 rounded bg-stone-900 hover:bg-stone-800 text-white font-medium transition-colors"
            >
              Submit Report
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
