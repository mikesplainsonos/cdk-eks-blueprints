"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cloneDeep = exports.setPath = void 0;
const aws_eks_1 = require("aws-cdk-lib/aws-eks");
const lodash_1 = require("lodash");
const setPath = (obj, path, val) => {
    const keys = path.split('.');
    const lastKey = keys.pop();
    const lastObj = keys.reduce((obj, key) => obj[key] = obj[key] || {}, obj);
    lastObj[lastKey] = val;
};
exports.setPath = setPath;
function cloneDeep(source) {
    return (0, lodash_1.cloneDeepWith)(source, (value) => {
        if (value && value instanceof aws_eks_1.KubernetesVersion) {
            return value;
        }
        return undefined;
    });
}
exports.cloneDeep = cloneDeep;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib2JqZWN0LXV0aWxzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vbGliL3V0aWxzL29iamVjdC11dGlscy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSxpREFBd0Q7QUFDeEQsbUNBQXVDO0FBRWhDLE1BQU0sT0FBTyxHQUFHLENBQUMsR0FBUyxFQUFFLElBQVksRUFBRSxHQUFRLEVBQUUsRUFBRTtJQUN6RCxNQUFNLElBQUksR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQzdCLE1BQU0sT0FBTyxHQUFHLElBQUksQ0FBQyxHQUFHLEVBQUcsQ0FBQztJQUM1QixNQUFNLE9BQU8sR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxFQUFFLENBQ3JDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxHQUFHLENBQUMsR0FBRyxDQUFDLElBQUksRUFBRSxFQUN6QixHQUFHLENBQUMsQ0FBQztJQUNULE9BQU8sQ0FBQyxPQUFPLENBQUMsR0FBRyxHQUFHLENBQUM7QUFDM0IsQ0FBQyxDQUFDO0FBUFcsUUFBQSxPQUFPLFdBT2xCO0FBR0YsU0FBZ0IsU0FBUyxDQUFJLE1BQVM7SUFDbEMsT0FBTyxJQUFBLHNCQUFhLEVBQUMsTUFBTSxFQUFFLENBQUMsS0FBSyxFQUFFLEVBQUU7UUFDbkMsSUFBRyxLQUFLLElBQUksS0FBSyxZQUFZLDJCQUFpQixFQUFFO1lBQzVDLE9BQU8sS0FBSyxDQUFDO1NBQ2hCO1FBQ0QsT0FBTyxTQUFTLENBQUM7SUFDckIsQ0FBQyxDQUFDLENBQUM7QUFDUCxDQUFDO0FBUEQsOEJBT0MiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBLdWJlcm5ldGVzVmVyc2lvbiB9IGZyb20gXCJhd3MtY2RrLWxpYi9hd3MtZWtzXCI7XG5pbXBvcnQgeyBjbG9uZURlZXBXaXRoIH0gZnJvbSAnbG9kYXNoJztcblxuZXhwb3J0IGNvbnN0IHNldFBhdGggPSAob2JqIDogYW55LCBwYXRoOiBzdHJpbmcsIHZhbDogYW55KSA9PiB7IFxuICAgIGNvbnN0IGtleXMgPSBwYXRoLnNwbGl0KCcuJyk7XG4gICAgY29uc3QgbGFzdEtleSA9IGtleXMucG9wKCkhO1xuICAgIGNvbnN0IGxhc3RPYmogPSBrZXlzLnJlZHVjZSgob2JqLCBrZXkpID0+IFxuICAgICAgICBvYmpba2V5XSA9IG9ialtrZXldIHx8IHt9LCBcbiAgICAgICAgb2JqKTsgXG4gICAgbGFzdE9ialtsYXN0S2V5XSA9IHZhbDtcbn07XG5cblxuZXhwb3J0IGZ1bmN0aW9uIGNsb25lRGVlcDxUPihzb3VyY2U6IFQpOiBUIHtcbiAgICByZXR1cm4gY2xvbmVEZWVwV2l0aChzb3VyY2UsICh2YWx1ZSkgPT4ge1xuICAgICAgICBpZih2YWx1ZSAmJiB2YWx1ZSBpbnN0YW5jZW9mIEt1YmVybmV0ZXNWZXJzaW9uKSB7XG4gICAgICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICB9KTtcbn1cbiJdfQ==