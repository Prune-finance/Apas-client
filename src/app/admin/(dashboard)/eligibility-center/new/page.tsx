import React, { Suspense } from "react";

function EligibilityCenterNew() {
  return <div>Page</div>;
}

export default function EligibilityCenterNewSus() {
  return (
    <Suspense>
      <EligibilityCenterNew />
    </Suspense>
  );
}
