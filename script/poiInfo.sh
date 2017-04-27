 #!/bin/bash -x

cd ..
#mongoexport  -h 182.92.176.84 -d travel1 -c restaurants -q "{"_id" : ObjectId('5322c08d2fab6f0c1d000005') }" -f _id,type,comments_url -o  Spiderdata/data1.json
#mongoexport  -h 182.92.176.84 -d travel1 -c restaurants -q "{city_name: /伦敦|巴塞罗那|新加坡|纽约|苏黎世|巴黎|洛杉矶|旧金山|芝加哥/i,show_flag:true,comments_url:/tripadvisor/i}" -f _id,type,comments_url -o  Spiderdata/data1.json
mongoexport  -h 182.92.176.84 -d travel1 -c latestattractions -q "{place_id:{\$exists:true}}" -f _id,type,place_id -o  Spiderdata/data1.json
cat Spiderdata/data1.json | sed -s 's/{ "$oid" ://g' | sed -s 's/}, "/,"/g' > Spiderdata/data.json


cat Spiderdata/data.json|while read myline
do
    #echo $myline
    id=`echo $myline|jq "._id"|sed -s 's/"//g'`
    mytype=`echo $myline|jq ".type"|sed -s 's/"//g'`
    place_id=`echo $myline|jq ".place_id"|sed -s 's/"//g'`
    echo "$id\t$mytype\t$url" >> ./logs/spider.log

    /usr/local/bin/node ./routes/poi_Import.js $id $mytype $place_id >> ./logs/spider.log
    sleep 2
done
echo "spider work done!" >> ./logs/spider.log
