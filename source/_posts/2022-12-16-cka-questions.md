---
layout: post
title: "cka questions"
date: 2022-12-16 17:06:22 +0800
comments: true
categories: [reading]
---

<!-- more -->


<details>
  <summary>1 RBAC</summary>

    $ kubectl create clusterrole deployment-clusterrole --verb=create -- resource=deployments,statefulsets,daemonsets
    $ kubectl create namespace app-team1
    $ kubectl -n app-team1 create serviceaccount cicd-token
    $ kubectl -n app-team1 create rolebinding cicd-token-binding --clusterrole=deployment- clusterrole --serviceaccount=app-team1:cicd-token
    验证：$ kubectl -n app-team1 describe rolebindings.rbac.authorization.k8s.io cicd-token-binding
</details>


<details>
  <summary>2 指定 node 设置为不可用</summary>

将名为 ek8s-node-1 的 node 设置为不可用，并且重新调度该 node 上所有允许的 pods 

    $ kubectl cordon ek8s-node-1
    $ kubectl drain ek8s-node-1 --ignore-daemonsets --delete-local-data --force
    验证：$ kubectl get nodes
</details>

<details>
  <summary>3 升级 kubernetes 节点</summary>

    $ kubectl config use-context mk8s 
    $ kubectl get nodes
    $ ssh mk8s-master-0
    $ kubectl cordon mk8s-master-0
    $ kubectl drain mk8s-master-0 --ignore-daemonsets
    $ sudo -i
    % apt-mark unhold kubeadm kubectl kubelet
    % apt-get update && apt-get install -y kubeadm=1.20.1-00 kubelet=1.20.1-00 kubectl=1.20.1- 00
    % apt-mark hold kubeadm kubectl kubelet
    % kubeadm upgrade plan
    % kubeadm upgrade apply v1.20.1 --etcd-upgrade=false 
    % exit
    现有的 Kubernetes 集权正在运行的版本是 1.18.8，仅将主节点上的所有 kubernetes 控 制面板和组件升级到版本 1.19.0
    另外，在主节点上升级 kubelet 和 kubectl
    $ kubectl rollout undo deployment coredns -n kube-system 
    $ exit
    验证：$ kubectl get node (确认只升级了 master 节点到 1.20.1 版本)

</details>

<details>
  <summary>4 etcd 备份还原</summary>

    如果环境中没有 etcdctl 这个命令，需要先执行如下指令: 
    $ sudo apt install etcd-client
    $ ETCDCTL_API=3 etcdctl --endpoints 127.0.0.1:2379 --cacert=/opt/KUIN00601/ca.crt -- cert=/opt/KUIN00601/etcd-client.crt --key=/opt/KUIN00601/etcd-client.key snapshot save /srv/data/etcd-snapshot.db
    #还原:要求使用指定文件进行还原(1.20 中可能需要 root 权限)
    $ ETCDCTL_API=3 etcdctl --endpoints 127.0.0.1:2379 --cacert=/opt/KUIN00601/ca.crt -- cert=/opt/KUIN00601/etcd-client.crt --key=/opt/KUIN00601/etcd-client.key snapshot restore /var/lib/backup/etcd-snapshot-previous.db

</details>

<details>
  <summary>5 创建 NetworkPolicy</summary>

命令

    $ kubectl config use-context hk8s
    $ vi netwokpolicy.yaml
    # 将上面的 yaml 内容粘贴进来
    $ kubectl apply -f netwokpolicy.yaml
    验证：$ kubectl get networkpolicy
    参考：concepts -> services networking -> network policy

5-1. 同一个 namespace

    apiVersion: networking.k8s.io/v1 kind: NetworkPolicy
    metadata:
        name: allow-port-from-namespace
        namespace: fubar 
    spec:
        podSelector: {} 
        policyTypes:
        - Ingress 
        ingress:
        - from:
            - podSelector: {} 
            ports:
            - protocol: TCP
              port: 80

5-2. 非同一个 namespace

    apiVersion: networking.k8s.io/v1 kind: NetworkPolicy
    metadata:
        name: allow-port-from-namespace
        namespace: fubar 
    spec:
        podSelector: {} 
        policyTypes:
        - Ingress 
        ingress:
        - from:
            - namespaceSelector:
                matchLabels: 
                    project: corp-bar
                ports:
                - protocol: TCP
                port: 80
</details>

<details>
  <summary>6 创建svc</summary>

    $ kubectl config use-context k8s
    $ kubectl expose deployment front-end --port=80 --target-port=80 --protocol=TCP --type=NodePort --name=front-end-svc
</details>

<details>
  <summary>7 创建ingress</summary>

    $ kubectl config use-context k8s
    $ vi ping-ingress.yaml
    # 将上面的 yaml 内容粘贴进来
    $ kubectl apply -f ping-ingress.yaml 
    验证：
    $ kubectl get ingress -n ing-internal -o wide // 获取ip地址
    $ curl -kL $(IP)
    参考：concepts -> services networking -> ingress
    # 返回 hello 即为成功
</details>

<details>
  <summary>8 扩展deployment</summary>

    $ kubectl config use-context k8s
    $ kubectl scale deployment guestbook --replicas=6
    验证：kubectl get deployment
</details>

<details>
  <summary>9 将pod部署到指定node节点上</summary>

命令：

    $ kubectl config use-context k8s
    $ kubectl run nginx-kusc00401 --image=nginx --dry-run=client -o yaml > pod-nginx.yaml 
    $ vi pod-nginx.yaml
    # 将上面的 yaml 内容粘贴进来
    $ kubectl apply -f pod-nginx.yaml
    验证: $ kubectl get po nginx-kusc00401 -o wide

yaml文件：

    apiVersion: v1 
    kind: Pod 
    metadata:
        name: nginx-kusc00401 
    spec:
        containers:
        - name: nginx
          image: nginx
          imagePullPolicy: IfNotPresent
        nodeSelector: 
          disk: ssd
</details>

<details>
  <summary>10 检查有多少node节点是健康状态</summary>

    $ kubectl config use-context k8s
    $ kubectl describe node |grep -i taints |grep -v -i noschedule 
    $ echo $Num > /opt/KUSC00402/kusc00402.txt
</details>

<details>
  <summary>11 创建多个container的Pod</summary>

命令：

    $ kubectl config use-context k8s
    $ kubectl run kucc4 --image=nginx --dry-run=client -oyaml > pod-kucc1.yaml
    $ vi pod-kucc4.yaml
    # 将上面的 yaml 内容粘贴进来 $ kubectl apply -f pod-kucc1.yaml

yaml:

    apiVersion: v1 
    kind: Pod 
    metadata:
        name: kucc1 
    spec:
        containers:
        - name: nginx
          image: nginx 
        - name: redis
          image: redis
</details>

<details>
  <summary>12 创建PV</summary>

命令：

    $ kubectl config use-context hk8s
    $ vi app-data-pv.yaml
    # 将上面的 yaml 内容粘贴进来 
    $ kubectl apply -f app-data-pv.yaml # 验证
    验证：$ kubectl get pv
    参考：tasks -> config pod and containers -> config a pod to use a pv

yaml:

    apiVersion: v1
    kind: PersistentVolume 
    metadata:
        name: app-config 
    spec:
        capacity: 
            storage: 2Gi
        accessModes:
            - ReadWriteMany
        hostPath:
            path: /srv/app-config
</details>

<details>
  <summary>13 创建PVC</summary>
命令：

    $ kubectl config use-context ok8s
    $ vi pv-volume-pvc.yaml
    # 将上面的 yaml 内容粘贴进来
    $ kubectl apply -f pv-volume-pvc.yaml # 验证
    验证：$ kubectl get pvc
    # 修改 pvc 10Mi --> 70Mi
    $ kubectl edit pvc pv-volume --record
    验证：$ kubectl get pvc
    参考：tasks -> config pod and containers -> config a pod to use a pv

yaml pvc:

    apiVersion: v1
    kind: PersistentVolumeClaim 
    metadata:
        name: pv-volume 
    spec:
        storageClassName: csi-hostpath-sc
        accessModes:
            - ReadWriteOnce
        resources: 
            requests:
                storage: 10Mi

yaml pod:

    apiVersion: v1 kind: Pod 
    metadata:
        name: web-server 
    spec:
        volumes:
            - name: mypv
                persistentVolumeClaim: 
                    claimName: pv-volume
        containers:
            - name: nginx
            image: nginx
            ports:
                - containerPort: 80
                    name: "http-server" 
            volumeMounts:
                - mountPath: "/usr/share/nginx/html" 
                    name: mypv
</details>

<details>
  <summary>14 监控pod的日志</summary>
监控 pod foobar 的日志并提取错误的 unable-access-website 相对于的日志写入到 /opt/KUTR00101/foobar

    $ kubectl config use-context k8s
    $ kubectl logs foobar | grep unable-to-access-website > /opt/KUTR00101/foobar
</details>

<details>
  <summary>15 sidercar container logging</summary>

    $ kubectl config use-context k8s
    $ kubectl get po 11-factor-app -o yaml > 15.yaml #
    $ kubectl delete -f 15.yaml
    $ kubectl apply -f 15.yaml
    验证：kubectl get pods / kubectl describe pod 11-factor-app
    参考：concepts -> cluster administration -> logging architecture
</details>

<details>
  <summary>16 查看cpu使用率pod</summary>

    $ kubectl top pod -l name=cpu-user -A --sort-by=cpu
    $ echo 'podname' >>/opt/KUTR00401/KUTR00401.txt
    验证：cat /opt/KUTR00401/KUTR00401.txt
</details>

<details>
  <summary>17 集群故障排查</summary>

    $ kubectl get nodes
    $ ssh wk8s-node-0
    % sudo -i
    % systemctl status kubelet
    % systemctl enable kubelet
    % systemctl restart kubelet
    % systemctl status kubelet
    % exit
    % exit
    $ kubectl get nodes
</details>












