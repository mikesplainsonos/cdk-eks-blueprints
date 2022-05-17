"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppMeshAddOn = void 0;
const aws_iam_1 = require("aws-cdk-lib/aws-iam");
const ts_deepmerge_1 = require("ts-deepmerge");
const cluster_providers_1 = require("../../cluster-providers");
const namespace_utils_1 = require("../../utils/namespace-utils");
const helm_addon_1 = require("../helm-addon");
/**
 * Defaults options for the add-on
 */
const defaultProps = {
    enableTracing: false,
    tracingProvider: "x-ray",
    name: "appmesh-controller",
    namespace: "appmesh-system",
    chart: "appmesh-controller",
    version: "1.4.4",
    release: "appmesh-release",
    repository: "https://aws.github.io/eks-charts"
};
class AppMeshAddOn extends helm_addon_1.HelmAddOn {
    constructor(props) {
        super({ ...defaultProps, ...props });
        this.options = this.props;
    }
    deploy(clusterInfo) {
        var _a;
        const cluster = clusterInfo.cluster;
        // App Mesh service account.
        const opts = { name: 'appmesh-controller', namespace: "appmesh-system" };
        const sa = cluster.addServiceAccount('appmesh-controller', opts);
        // Cloud Map Full Access policy.
        const cloudMapPolicy = aws_iam_1.ManagedPolicy.fromAwsManagedPolicyName("AWSCloudMapFullAccess");
        sa.role.addManagedPolicy(cloudMapPolicy);
        // App Mesh Full Access policy.
        const appMeshPolicy = aws_iam_1.ManagedPolicy.fromAwsManagedPolicyName("AWSAppMeshFullAccess");
        sa.role.addManagedPolicy(appMeshPolicy);
        if (this.options.enableTracing && this.options.tracingProvider === "x-ray") {
            const xrayPolicy = aws_iam_1.ManagedPolicy.fromAwsManagedPolicyName("AWSXRayDaemonWriteAccess");
            const nodeGroups = (0, cluster_providers_1.assertEC2NodeGroup)(clusterInfo, "App Mesh X-Ray integration");
            nodeGroups.forEach(ng => ng.role.addManagedPolicy(xrayPolicy));
        }
        // App Mesh Namespace
        const namespace = (0, namespace_utils_1.createNamespace)('appmesh-system', cluster);
        sa.node.addDependency(namespace);
        let values = {
            region: cluster.stack.region,
            serviceAccount: {
                create: false,
                name: 'appmesh-controller'
            },
            tracing: {
                enabled: this.options.enableTracing,
                provider: this.options.tracingProvider,
                address: this.options.tracingAddress,
                port: this.options.tracingPort
            }
        };
        values = (0, ts_deepmerge_1.default)(values, (_a = this.props.values) !== null && _a !== void 0 ? _a : {});
        const chart = this.addHelmChart(clusterInfo, values);
        chart.node.addDependency(sa);
    }
}
exports.AppMeshAddOn = AppMeshAddOn;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9saWIvYWRkb25zL2FwcG1lc2gvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsaURBQW9EO0FBQ3BELCtDQUFpQztBQUNqQywrREFBNkQ7QUFFN0QsaUVBQThEO0FBQzlELDhDQUE4RDtBQStCOUQ7O0dBRUc7QUFDSCxNQUFNLFlBQVksR0FBRztJQUNqQixhQUFhLEVBQUUsS0FBSztJQUNwQixlQUFlLEVBQUUsT0FBTztJQUN4QixJQUFJLEVBQUUsb0JBQW9CO0lBQzFCLFNBQVMsRUFBRSxnQkFBZ0I7SUFDM0IsS0FBSyxFQUFFLG9CQUFvQjtJQUMzQixPQUFPLEVBQUUsT0FBTztJQUNoQixPQUFPLEVBQUUsaUJBQWlCO0lBQzFCLFVBQVUsRUFBRSxrQ0FBa0M7Q0FDakQsQ0FBQztBQUVGLE1BQWEsWUFBYSxTQUFRLHNCQUFTO0lBSXZDLFlBQVksS0FBeUI7UUFDakMsS0FBSyxDQUFDLEVBQUUsR0FBRyxZQUFZLEVBQUUsR0FBRyxLQUFLLEVBQUUsQ0FBQyxDQUFDO1FBQ3JDLElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQztJQUM5QixDQUFDO0lBRVEsTUFBTSxDQUFDLFdBQXdCOztRQUVwQyxNQUFNLE9BQU8sR0FBRyxXQUFXLENBQUMsT0FBTyxDQUFDO1FBRXBDLDRCQUE0QjtRQUM1QixNQUFNLElBQUksR0FBRyxFQUFFLElBQUksRUFBRSxvQkFBb0IsRUFBRSxTQUFTLEVBQUUsZ0JBQWdCLEVBQUUsQ0FBQztRQUN6RSxNQUFNLEVBQUUsR0FBRyxPQUFPLENBQUMsaUJBQWlCLENBQUMsb0JBQW9CLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFFakUsZ0NBQWdDO1FBQ2hDLE1BQU0sY0FBYyxHQUFHLHVCQUFhLENBQUMsd0JBQXdCLENBQUMsdUJBQXVCLENBQUMsQ0FBQztRQUN2RixFQUFFLENBQUMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLGNBQWMsQ0FBQyxDQUFDO1FBRXpDLCtCQUErQjtRQUMvQixNQUFNLGFBQWEsR0FBRyx1QkFBYSxDQUFDLHdCQUF3QixDQUFDLHNCQUFzQixDQUFDLENBQUM7UUFDckYsRUFBRSxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxhQUFhLENBQUMsQ0FBQztRQUV4QyxJQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsYUFBYSxJQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsZUFBZSxLQUFLLE9BQU8sRUFBRTtZQUN4RSxNQUFNLFVBQVUsR0FBRyx1QkFBYSxDQUFDLHdCQUF3QixDQUFDLDBCQUEwQixDQUFDLENBQUM7WUFDdEYsTUFBTSxVQUFVLEdBQUcsSUFBQSxzQ0FBa0IsRUFBQyxXQUFXLEVBQUUsNEJBQTRCLENBQUMsQ0FBQztZQUNqRixVQUFVLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDO1NBQ2xFO1FBRUQscUJBQXFCO1FBQ3JCLE1BQU0sU0FBUyxHQUFHLElBQUEsaUNBQWUsRUFBQyxnQkFBZ0IsRUFBRSxPQUFPLENBQUMsQ0FBQztRQUM3RCxFQUFFLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUVqQyxJQUFJLE1BQU0sR0FBVztZQUNqQixNQUFNLEVBQUUsT0FBTyxDQUFDLEtBQUssQ0FBQyxNQUFNO1lBQzVCLGNBQWMsRUFBRTtnQkFDWixNQUFNLEVBQUUsS0FBSztnQkFDYixJQUFJLEVBQUUsb0JBQW9CO2FBQzdCO1lBQ0QsT0FBTyxFQUFFO2dCQUNMLE9BQU8sRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLGFBQWE7Z0JBQ25DLFFBQVEsRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLGVBQWU7Z0JBQ3RDLE9BQU8sRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLGNBQWM7Z0JBQ3BDLElBQUksRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLFdBQVc7YUFDakM7U0FDSixDQUFDO1FBRUYsTUFBTSxHQUFHLElBQUEsc0JBQUssRUFBQyxNQUFNLEVBQUUsTUFBQSxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sbUNBQUksRUFBRSxDQUFDLENBQUM7UUFFaEQsTUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxXQUFXLEVBQUUsTUFBTSxDQUFDLENBQUM7UUFDckQsS0FBSyxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsRUFBRSxDQUFDLENBQUM7SUFDakMsQ0FBQztDQUNKO0FBdERELG9DQXNEQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IE1hbmFnZWRQb2xpY3kgfSBmcm9tIFwiYXdzLWNkay1saWIvYXdzLWlhbVwiO1xuaW1wb3J0IG1lcmdlIGZyb20gXCJ0cy1kZWVwbWVyZ2VcIjtcbmltcG9ydCB7IGFzc2VydEVDMk5vZGVHcm91cCB9IGZyb20gXCIuLi8uLi9jbHVzdGVyLXByb3ZpZGVyc1wiO1xuaW1wb3J0IHsgQ2x1c3RlckluZm8sIFZhbHVlcyB9IGZyb20gXCIuLi8uLi9zcGlcIjtcbmltcG9ydCB7IGNyZWF0ZU5hbWVzcGFjZSB9IGZyb20gXCIuLi8uLi91dGlscy9uYW1lc3BhY2UtdXRpbHNcIjtcbmltcG9ydCB7IEhlbG1BZGRPbiwgSGVsbUFkZE9uVXNlclByb3BzIH0gZnJvbSBcIi4uL2hlbG0tYWRkb25cIjtcblxuXG4vKipcbiAqIENvbmZpZ3VyYXRpb24gb3B0aW9ucyBmb3IgdGhlIGFkZC1vbi5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBBcHBNZXNoQWRkT25Qcm9wcyBleHRlbmRzIEhlbG1BZGRPblVzZXJQcm9wcyB7XG4gICAgLyoqXG4gICAgICogSWYgc2V0IHRvIHRydWUsIHdpbGwgZW5hYmxlIHRyYWNpbmcgdGhyb3VnaCBBcHAgTWVzaCBzaWRlY2Fycywgc3VjaCBhcyBYLVJheSBkaXN0cmlidXRlZCB0cmFjaW5nLlxuICAgICAqIE5vdGU6IHN1cHBvcnQgZm9yIFgtUmF5IHRyYWNpbmcgZG9lcyBub3QgZGVwZW5kIG9uIHRoZSBYUmF5IERhZW1vbiBBZGRPbiBpbnN0YWxsZWQuXG4gICAgICovXG4gICAgZW5hYmxlVHJhY2luZz86IGJvb2xlYW4sXG5cbiAgICAvKipcbiAgICAgKiBUcmFjaW5nIHByb3ZpZGVyLiBTdXBwb3J0ZWQgdmFsdWVzIGFyZSB4LXJheSwgamFlZ2VyLCBkYXRhZG9nXG4gICAgICovXG4gICAgdHJhY2luZ1Byb3ZpZGVyPzogXCJ4LXJheVwiIHwgXCJqYWVnZXJcIiB8IFwiZGF0YWRvZ1wiXG5cbiAgICAvKipcbiAgICAgKiBVc2VkIGZvciBEYXRhZG9nIG9yIEphZWdlciB0cmFjaW5nLiBFeGFtcGxlIHZhbHVlczogZGF0YWRvZy5hcHBtZXNoLXN5c3RlbS4gXG4gICAgICogUmVmZXIgdG8gaHR0cHM6Ly9hd3MuZ2l0aHViLmlvL2F3cy1hcHAtbWVzaC1jb250cm9sbGVyLWZvci1rOHMvZ3VpZGUvdHJhY2luZy8gZm9yIG1vcmUgaW5mb3JtYXRpb24uXG4gICAgICogSWdub3JlZCBmb3IgWC1SYXkuXG4gICAgICovXG4gICAgdHJhY2luZ0FkZHJlc3M/OiBzdHJpbmcsXG5cbiAgICAvKipcbiAgICAgKiBKYWVnZXIgb3IgRGF0YWRvZyBhZ2VudCBwb3J0IChpZ25vcmVkIGZvciBYLVJheSlcbiAgICAgKi9cbiAgICB0cmFjaW5nUG9ydD86IHN0cmluZ1xufVxuXG4vKipcbiAqIERlZmF1bHRzIG9wdGlvbnMgZm9yIHRoZSBhZGQtb25cbiAqL1xuY29uc3QgZGVmYXVsdFByb3BzID0ge1xuICAgIGVuYWJsZVRyYWNpbmc6IGZhbHNlLFxuICAgIHRyYWNpbmdQcm92aWRlcjogXCJ4LXJheVwiLFxuICAgIG5hbWU6IFwiYXBwbWVzaC1jb250cm9sbGVyXCIsXG4gICAgbmFtZXNwYWNlOiBcImFwcG1lc2gtc3lzdGVtXCIsXG4gICAgY2hhcnQ6IFwiYXBwbWVzaC1jb250cm9sbGVyXCIsXG4gICAgdmVyc2lvbjogXCIxLjQuNFwiLFxuICAgIHJlbGVhc2U6IFwiYXBwbWVzaC1yZWxlYXNlXCIsXG4gICAgcmVwb3NpdG9yeTogXCJodHRwczovL2F3cy5naXRodWIuaW8vZWtzLWNoYXJ0c1wiXG59O1xuXG5leHBvcnQgY2xhc3MgQXBwTWVzaEFkZE9uIGV4dGVuZHMgSGVsbUFkZE9uIHtcblxuICAgIHJlYWRvbmx5IG9wdGlvbnM6IEFwcE1lc2hBZGRPblByb3BzO1xuXG4gICAgY29uc3RydWN0b3IocHJvcHM/OiBBcHBNZXNoQWRkT25Qcm9wcykge1xuICAgICAgICBzdXBlcih7IC4uLmRlZmF1bHRQcm9wcywgLi4ucHJvcHMgfSk7XG4gICAgICAgIHRoaXMub3B0aW9ucyA9IHRoaXMucHJvcHM7XG4gICAgfVxuXG4gICAgb3ZlcnJpZGUgZGVwbG95KGNsdXN0ZXJJbmZvOiBDbHVzdGVySW5mbyk6IHZvaWQge1xuXG4gICAgICAgIGNvbnN0IGNsdXN0ZXIgPSBjbHVzdGVySW5mby5jbHVzdGVyO1xuXG4gICAgICAgIC8vIEFwcCBNZXNoIHNlcnZpY2UgYWNjb3VudC5cbiAgICAgICAgY29uc3Qgb3B0cyA9IHsgbmFtZTogJ2FwcG1lc2gtY29udHJvbGxlcicsIG5hbWVzcGFjZTogXCJhcHBtZXNoLXN5c3RlbVwiIH07XG4gICAgICAgIGNvbnN0IHNhID0gY2x1c3Rlci5hZGRTZXJ2aWNlQWNjb3VudCgnYXBwbWVzaC1jb250cm9sbGVyJywgb3B0cyk7XG5cbiAgICAgICAgLy8gQ2xvdWQgTWFwIEZ1bGwgQWNjZXNzIHBvbGljeS5cbiAgICAgICAgY29uc3QgY2xvdWRNYXBQb2xpY3kgPSBNYW5hZ2VkUG9saWN5LmZyb21Bd3NNYW5hZ2VkUG9saWN5TmFtZShcIkFXU0Nsb3VkTWFwRnVsbEFjY2Vzc1wiKTtcbiAgICAgICAgc2Eucm9sZS5hZGRNYW5hZ2VkUG9saWN5KGNsb3VkTWFwUG9saWN5KTtcblxuICAgICAgICAvLyBBcHAgTWVzaCBGdWxsIEFjY2VzcyBwb2xpY3kuXG4gICAgICAgIGNvbnN0IGFwcE1lc2hQb2xpY3kgPSBNYW5hZ2VkUG9saWN5LmZyb21Bd3NNYW5hZ2VkUG9saWN5TmFtZShcIkFXU0FwcE1lc2hGdWxsQWNjZXNzXCIpO1xuICAgICAgICBzYS5yb2xlLmFkZE1hbmFnZWRQb2xpY3koYXBwTWVzaFBvbGljeSk7XG5cbiAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5lbmFibGVUcmFjaW5nICYmIHRoaXMub3B0aW9ucy50cmFjaW5nUHJvdmlkZXIgPT09IFwieC1yYXlcIikge1xuICAgICAgICAgICAgY29uc3QgeHJheVBvbGljeSA9IE1hbmFnZWRQb2xpY3kuZnJvbUF3c01hbmFnZWRQb2xpY3lOYW1lKFwiQVdTWFJheURhZW1vbldyaXRlQWNjZXNzXCIpO1xuICAgICAgICAgICAgY29uc3Qgbm9kZUdyb3VwcyA9IGFzc2VydEVDMk5vZGVHcm91cChjbHVzdGVySW5mbywgXCJBcHAgTWVzaCBYLVJheSBpbnRlZ3JhdGlvblwiKTtcbiAgICAgICAgICAgIG5vZGVHcm91cHMuZm9yRWFjaChuZyA9PiBuZy5yb2xlLmFkZE1hbmFnZWRQb2xpY3koeHJheVBvbGljeSkpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gQXBwIE1lc2ggTmFtZXNwYWNlXG4gICAgICAgIGNvbnN0IG5hbWVzcGFjZSA9IGNyZWF0ZU5hbWVzcGFjZSgnYXBwbWVzaC1zeXN0ZW0nLCBjbHVzdGVyKTtcbiAgICAgICAgc2Eubm9kZS5hZGREZXBlbmRlbmN5KG5hbWVzcGFjZSk7XG5cbiAgICAgICAgbGV0IHZhbHVlczogVmFsdWVzID0ge1xuICAgICAgICAgICAgcmVnaW9uOiBjbHVzdGVyLnN0YWNrLnJlZ2lvbixcbiAgICAgICAgICAgIHNlcnZpY2VBY2NvdW50OiB7XG4gICAgICAgICAgICAgICAgY3JlYXRlOiBmYWxzZSxcbiAgICAgICAgICAgICAgICBuYW1lOiAnYXBwbWVzaC1jb250cm9sbGVyJ1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHRyYWNpbmc6IHtcbiAgICAgICAgICAgICAgICBlbmFibGVkOiB0aGlzLm9wdGlvbnMuZW5hYmxlVHJhY2luZyxcbiAgICAgICAgICAgICAgICBwcm92aWRlcjogdGhpcy5vcHRpb25zLnRyYWNpbmdQcm92aWRlcixcbiAgICAgICAgICAgICAgICBhZGRyZXNzOiB0aGlzLm9wdGlvbnMudHJhY2luZ0FkZHJlc3MsXG4gICAgICAgICAgICAgICAgcG9ydDogdGhpcy5vcHRpb25zLnRyYWNpbmdQb3J0XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG5cbiAgICAgICAgdmFsdWVzID0gbWVyZ2UodmFsdWVzLCB0aGlzLnByb3BzLnZhbHVlcyA/PyB7fSk7XG4gICAgICAgIFxuICAgICAgICBjb25zdCBjaGFydCA9IHRoaXMuYWRkSGVsbUNoYXJ0KGNsdXN0ZXJJbmZvLCB2YWx1ZXMpO1xuICAgICAgICBjaGFydC5ub2RlLmFkZERlcGVuZGVuY3koc2EpO1xuICAgIH1cbn0iXX0=