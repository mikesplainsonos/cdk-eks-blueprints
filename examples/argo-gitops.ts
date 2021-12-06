import { Construct } from "@aws-cdk/core";
import { ArgoCDAddOn } from "../lib";
import { HelmChartDeployment } from "../lib/addons/helm-addon/kubectl-provider";
import { ClusterInfo } from "../lib/spi";

export const createArgoHelmApplication = function(clusterInfo: ClusterInfo, helmDeployment: HelmChartDeployment): Construct {
    const argoAddOn = getArgoApplicationGenerator(clusterInfo);
    return argoAddOn.generate(clusterInfo, {
        name: helmDeployment.name,
        namespace: helmDeployment.namespace,
        values: helmDeployment.values
    })
};

function getArgoApplicationGenerator(clusterInfo: ClusterInfo) : ArgoCDAddOn {
    for (let addOn of clusterInfo.getResourceContext().blueprintProps.addOns?? []) {
        const generator : any = addOn;
        if(generator instanceof ArgoCDAddOn) {
            return generator;
        }
    }
    throw Error("GitOps Engine is not defined in the blueprint");
}
