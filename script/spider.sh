#!/bin/bash -x

cd ..
mongoexport  -h 123.57.149.81 -d travel1 -c restaurants -q "{city_name: /伦敦|巴塞罗那|新加坡|纽约|苏黎世|巴黎|洛杉矶|旧金山|芝加哥/i,show_flag:true,comments_url:/tripadvisor/i}" -f _id,type,comments_url -o  Spiderdata/data1.json
cat Spiderdata/data1.json | sed -s 's/{ "$oid" ://g' | sed -s 's/}, "/,"/g' > Spiderdata/data.json

cat Spiderdata/data.json|while read myline
do
    #echo $myline
    id=`echo $myline|jq "._id"|sed -s 's/"//g'`
    mytype=`echo $myline|jq ".type"|sed -s 's/"//g'`
    url=`echo $myline|jq ".comments_url"|sed -s 's/"//g'`
    echo "$id\t$mytype\t$url" >> ./logs/spider.log

    /usr/local/bin/node ./routes/tripadvisorSpider.js $id $mytype $url >> ./logs/spider.log
    sleep 5
done
echo "spider work done!" >> ./logs/spider.log
