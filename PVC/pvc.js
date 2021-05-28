let nodes=[{x:371,y:288},{x:652,y:170},{x:989,y:238},{x:968,y:512},{x:682,y:540},{x:387,y:512},{x:566,y:329},{x:800,y:300},{x:1112,y:407},{x:192,y:386},{x:1000,y:96},{x:652,y:676},{x:866,y:638},{x:480,y:572},{x:384,y:406},{x:398,y:200}];
let cpt=0;
let cpt0=0;
let cpt1=1;
let able=true;
let graph;
let edgesResult=[];
window.onload=function()
{
    d3.select('#somOK').on('click', recupererSommets);
    d3.select('#arcOK').on('click', cout);
}
const recupererSommets= function()
{
    cpt = parseInt(document.getElementById("sommets").value);
    if (cpt > 0)
    {
        graph=new Graph(cpt);
        for (let i = 0; i< cpt; i++) 
            {
                for(let l=i+1;l<cpt;l++)
                {            
                        
                        let path = d3.path();
                        path.moveTo(nodes[i].x,nodes[i].y);
                        path.lineTo(nodes[l].x,nodes[l].y);
                        path.closePath();
                        d3.select("#svg").append("path").attr("d", path).attr("stroke", "white").attr("id","path"+i+l);
                }

            } 
            for (let i = 0; i < cpt; i++) {
        
                d3.select("#svg").append("circle").attr("cx", nodes[i].x).attr("cy", nodes[i].y).attr("r", 28).attr("fill", "#79C6A3");
                d3.select("#svg").append("circle").attr("cx", nodes[i].x).attr("cy", nodes[i].y).attr("r",25 ).attr("fill", "#050200").style("cursor","pointer").attr("id","N"+i);
                d3.select("#svg").append("text").attr("x", nodes[i].x-6).attr("y", nodes[i].y+8).style("font-size",18).style("font-weight",100).style("fill", "#FFFFFF").style("font-family",'Roboto').text(i); 
            }   

        return true;
        
    }
    return false;
    
}
const cout=function()
{
    if(able)
    {
        let cout=parseInt(document.getElementById("poids").value);
        d3.select("#svg").append("text").attr("x", (nodes[cpt0].x+nodes[cpt1].x)/2-6).attr("y", (nodes[cpt0].y+nodes[cpt1].y)/2).style("font-size",18).style("font-weight",100).style("fill", "#FFFFFF").style("font-family",'Roboto').text(cout).attr("id","cout"+cpt0+cpt1);
        graph.addEdge(new Edge(cpt0,cpt1,cout));
        cpt1++;
        if(cpt1<cpt)
        {
            d3.select("#cpt1").text(cpt1);
        }
        else
        {
            cpt0++;
            if(cpt0<cpt-1)
            {
                cpt1=cpt0+1;
                d3.select("#cpt1").text(cpt1);
                d3.select("#cpt0").text(cpt0);
            }
            else
            {
                d3.select("#cpt1").text("");
                d3.select("#cpt0").text("");
                able=false;
                d3.select("#resultat").on('click',result);
            }
        }
    }
}
const result=function ()
{
    let result=graph.pvc();
    let edges=result.edges;
    for (let i = 0; i < graph.edges.length; i++) {
        if(!edgesResult.includes(i))
        {        
            d3.select("#path"+graph.edges[i].first+graph.edges[i].second).style("visibility","hidden");
            d3.select("#cout"+graph.edges[i].first+graph.edges[i].second).style("visibility","hidden");
        }
    }
    d3.select("#svg").append("rect").attr("x", 480).attr("y", 696).attr("width", 250).attr("height", 40).attr("rx",18).attr("fill", "#8DCEA8").attr("id", "force");
    d3.select("#svg").append("text").attr("x", 540).attr("y", 726).style("font-size",26).style("font-weight",400).style("fill", "#FFFFFF").style("font-family",'Roboto').text("Force Brute").attr("id","text1"); 
    d3.select("#svg").append("rect").attr("x", 260).attr("y", 696).attr("width", 200).attr("height", 40).attr("rx",18).attr("fill", "#FFFFFF").attr("id", "temps");
    d3.select("#svg").append("text").attr("x", 320).attr("y", 726).style("font-size",26).style("font-weight",400).style("fill", "#292C34").style("font-family",'Roboto').text(result.time).attr("id","text2"); 
    d3.select("#svg").append("rect").attr("x", 750).attr("y", 696).attr("width", 200).attr("height", 40).attr("rx",18).attr("fill", "#FFFFFF").attr("id", "cout");
    d3.select("#svg").append("text").attr("x", 840).attr("y", 726).style("font-size",26).style("font-weight",400).style("fill", "#292C34").style("font-family",'Roboto').text(result.cout).attr("id","text2"); 
    let resultNaive=graph.PVC_DFS();
    
}
class Graph 
{
        constructor(verteces)
        {
            this.verteces=verteces;
            this.edges=[];
            this.vertex=[];
            for (let i = 0; i < verteces; i++) {
                this.vertex.push([]);
                for (let j = 0; j < verteces; j++) 
                {
                    this.vertex[i].push(0);
                    
                }
                
            }
        
        }
        addEdge(edge)
        { 
            this.edges.push(edge);
            this.vertex[edge.first][edge.second]=edge.weight;
            this.vertex[edge.second][edge.first]=edge.weight;
            this.minCost=-1;
            this.minPath;
        }
        afficher()
        {
            console.log(this.edges);
            console.log(this.vertex);
        }
        order()
        {
            this.edges.sort(this.compare);
        }
        compare(edge1,edge2)
        {
            if(edge1.weight==edge2.weight)
            {
                return 0;
            }
            else
            {
                if(edge1.weight>edge2.weight)
                    return 1;
                else 
                    return -1;
            }
        }
        pvc()
        {
            let date1=new Date();
            let time1= date1.getTime();
            console.log(time1);
            let degree=[];
            let newEdges=[];
            let coutMin=0;
            let newVertices=[];
            let nbVertices=0;
            this.order();
            for (let i = 0; i < this.verteces; i++) 
            {
                degree.push(0);  
                newVertices.push({f:-1,s:-1});
            }
            for (let j = 0; j < this.edges.length && newEdges.length<this.verteces; j++) {
                
                if(degree[this.edges[j].first]<2 && degree[this.edges[j].second]<2 && !(newVertices[this.edges[j].first].s>0 && newVertices[this.edges[j].second].s>0 && nbVertices<this.verteces))
                {
                    edgesResult.push(j);
                    newEdges.push(this.edges[j]);
                    degree[this.edges[j].first]++;
                    degree[this.edges[j].second]++;
                    if(newVertices[this.edges[j].first].f<0 && newVertices[this.edges[j].first].s<0 )
                    {
                        nbVertices++;
                    }
                    if(newVertices[this.edges[j].second].f<0 && newVertices[this.edges[j].second].s<0 )
                    {
                        nbVertices++;
                    }
                    coutMin+=this.edges[j].weight;
                    newVertices[this.edges[j].first].f=1;
                    newVertices[this.edges[j].second].s=1;
                }
                
            }
            let date2=new Date();
            let time2= date2.getTime();
            return ({edges:newEdges, cout:coutMin, time:time2-time1});
            
        }
        DFS(v,parent,cost)
        {
            parent.push(v);
            for (let i = 0; i < this.verteces; i++) 
            {
                if(i!=v)
                {
                    if(i==0 && parent.length==this.verteces)
                    {
                        parent.push(0);
                        cost+= this.vertex[v][0].weight; 
                        if(this.minCost=-1 || this.minCost>cost)  
                        {
                            this.minCost=cost;
                            this.minPath=parent;
                        } 
                        

                    } 
                    else
                    {                    
                        if(!parent.includes(i) )
                        {
                            cost+= this.vertex[v][i].weight;
                            this.DFS(i,parent,cost);
                            parent.pop();
                            
                        }
                    }
                }    
            }  
        }
        PVC_DFS()
        {
            let parent=[];
            let cost=0;
            this.DFS(0,parent,cost);
            console.log(this.minCost,this.minPath);
            
                
            
        }

            
}
class Edge
{
    constructor(f,s,w)
    {
        if(f<s)
        {        
            this.first=f;
            this.second=s;
        }
        else
        {
            this.second=f;
            this.first=s;   
        }
        this.weight=w;
    }

}
/*let graph= new Graph (4);
graph.addEdge(new Edge(0,1,10));
graph.addEdge(new Edge(0,2,20));
graph.addEdge(new Edge(0,3,5));
graph.addEdge(new Edge(1,2,15));
graph.addEdge(new Edge(1,3,10));
graph.addEdge(new Edge(2,3,30));
graph.order();
graph.afficher();
graph.pvc();*/